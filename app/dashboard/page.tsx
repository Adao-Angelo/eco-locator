"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { RecyclingPointsService } from "@/lib/supabase/services/recycling-points-service";
import {
  Activity,
  BarChart3,
  Clock,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "./_components/logout-button";

// Componente do mapa com importação dinâmica
const MapWithPoints = dynamic(() => import("./_components/map-with-points"), {
  ssr: false,
  loading: () => (
    <div className="h-80 flex items-center justify-center text-zinc-400 border border-white/10 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  ),
});

type RecyclingPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  materials: string[];
  operating_hours: string;
  contact: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type MaterialType =
  | "plastic"
  | "glass"
  | "electronics"
  | "paper"
  | "metal"
  | "batteries";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [recyclingPoints, setRecyclingPoints] = useState<RecyclingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    materialTypes: 0,
  });

  // Estados para filtros
  const [search, setSearch] = useState("");
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Estados para modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>(
    []
  );
  const [submitting, setSubmitting] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: -23.5505, // São Paulo como padrão
    longitude: -46.6333,
    operating_hours: "08:00-18:00",
    contact: "",
    status: "active" as "active" | "inactive",
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadUserAndPoints();
  }, []);

  // Atualizar estatísticas quando os pontos mudarem
  useEffect(() => {
    updateStats();
  }, [recyclingPoints]);

  const loadUserAndPoints = async () => {
    try {
      // Carregar usuário
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Carregar pontos do Supabase
      const points = await RecyclingPointsService.getAllPoints();
      setRecyclingPoints(points);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const total = recyclingPoints.length;
    const active = recyclingPoints.filter(
      (point) => point.status === "active"
    ).length;
    const inactive = total - active;

    // Contar tipos de materiais únicos
    const allMaterials = recyclingPoints.flatMap((point) => point.materials);
    const uniqueMaterials = new Set(allMaterials).size;

    setStats({
      total,
      active,
      inactive,
      materialTypes: uniqueMaterials,
    });
  };

  // Filtrar pontos baseado nos filtros ativos
  const filteredPoints = recyclingPoints.filter((point) => {
    const matchesSearch =
      search === "" ||
      point.name.toLowerCase().includes(search.toLowerCase()) ||
      point.address.toLowerCase().includes(search.toLowerCase());

    const matchesMaterial =
      materialFilter === "all" || point.materials.includes(materialFilter);

    const matchesStatus =
      statusFilter === "all" || point.status === statusFilter;

    return matchesSearch && matchesMaterial && matchesStatus;
  });

  // Opções de materiais
  const materialOptions: MaterialType[] = [
    "plastic",
    "glass",
    "electronics",
    "paper",
    "metal",
    "batteries",
  ];

  // Contagem de materiais para gráfico
  const materialCounts = recyclingPoints.reduce((acc, point) => {
    point.materials.forEach((material) => {
      acc[material] = (acc[material] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Handlers
  const handleMaterialToggle = (material: MaterialType) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to create recycling points");
      return;
    }

    if (selectedMaterials.length === 0) {
      alert("Please select at least one material");
      return;
    }

    setSubmitting(true);

    try {
      const newPoint = {
        name: formData.name,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        operating_hours: formData.operating_hours,
        contact: formData.contact,
        status: formData.status,
        materials: selectedMaterials,
        created_by: user.id,
      };

      const createdPoint = await RecyclingPointsService.createPoint(newPoint);

      // Atualizar a lista de pontos
      setRecyclingPoints((prev) => [createdPoint, ...prev]);

      // Fechar modal e resetar form
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating point:", error);
      alert("Error creating recycling point. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePoint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recycling point?")) {
      return;
    }

    try {
      await RecyclingPointsService.deletePoint(id);
      // Remover ponto da lista
      setRecyclingPoints((prev) => prev.filter((point) => point.id !== id));
    } catch (error) {
      console.error("Error deleting point:", error);
      alert("Error deleting recycling point. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      latitude: -23.5505,
      longitude: -46.6333,
      operating_hours: "08:00-18:00",
      contact: "",
      status: "active",
    });
    setSelectedMaterials([]);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-emerald-950 to-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-zinc-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-emerald-950 to-zinc-900 text-white">
      {/* Header */}
      <header className="w-full bg-zinc-900/80 backdrop-blur-md border-b border-white/10 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">♻️</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Eco<span className="text-emerald-400">Locator</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setOpenModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 border-none text-white flex items-center gap-2"
            >
              <Plus size={18} /> Add Point
            </Button>
            <Avatar className="border border-white/20">
              <AvatarFallback className="bg-emerald-600">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12 space-y-8">
        {/* Welcome Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.email?.split("@")[0] || "Admin"}!
          </h2>
          <p className="text-zinc-400 text-lg">
            Manage your recycling points and monitor collection data
          </p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Points"
            value={stats.total}
            icon={<MapPin className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            title="Active Points"
            value={stats.active}
            icon={<Activity className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Material Types"
            value={stats.materialTypes}
            icon={<BarChart3 className="w-5 h-5" />}
            color="yellow"
          />
          <StatCard
            title="Inactive Points"
            value={stats.inactive}
            icon={<Users className="w-5 h-5" />}
            color="red"
          />
        </div>

        {/* Filters Section */}
        <section className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search size={20} />
            Search & Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search by name or address..."
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={materialFilter} onValueChange={setMaterialFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Materials</SelectItem>
                {materialOptions.map((material) => (
                  <SelectItem key={material} value={material}>
                    <span className="capitalize">{material}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Map Overview</h2>
          <MapWithPoints points={filteredPoints} />
        </section>

        {/* Materials Distribution */}
        <section className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Materials Distribution</h2>
          <div className="space-y-3">
            {materialOptions.map((material) => {
              const count = materialCounts[material] || 0;
              const percentage =
                stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <div key={material} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-zinc-300 capitalize">
                      {material}
                    </span>
                    <span className="text-zinc-400">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Points List Section */}
        <section className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recycling Points</h2>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-sm">
                Showing {filteredPoints.length} of {stats.total} points
              </span>
              <Button
                onClick={() => setOpenModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 border-none text-white flex items-center gap-2"
                size="sm"
              >
                <Plus size={16} /> Add New
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPoints.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No recycling points found</p>
                <p className="text-sm mb-4">
                  {search || materialFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first recycling point"}
                </p>
                <Button
                  onClick={() => setOpenModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus size={16} className="mr-2" />
                  Add First Point
                </Button>
              </div>
            ) : (
              filteredPoints.map((point) => (
                <PointCard
                  key={point.id}
                  point={point}
                  onDelete={() => handleDeletePoint(point.id)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Add Point Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-zinc-900 text-white border border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Plus size={20} />
              Add New Recycling Point
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-6 mt-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-emerald-400">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Point Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Central Recycling Station"
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium">
                    Contact
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
                    <Input
                      id="contact"
                      placeholder="(11) 9999-8888"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                      value={formData.contact}
                      onChange={(e) =>
                        handleInputChange("contact", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
                  <Input
                    id="address"
                    placeholder="Av. Paulista, 1000 - São Paulo, SP"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-emerald-400">Location</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm font-medium">
                    Latitude *
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="-23.5505"
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                    value={formData.latitude}
                    onChange={(e) =>
                      handleInputChange(
                        "latitude",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm font-medium">
                    Longitude *
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="-46.6333"
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                    value={formData.longitude}
                    onChange={(e) =>
                      handleInputChange(
                        "longitude",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Operating Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-emerald-400">
                Operating Details
              </h3>

              <div className="space-y-2">
                <Label
                  htmlFor="operating_hours"
                  className="text-sm font-medium"
                >
                  Operating Hours *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
                  <Input
                    id="operating_hours"
                    placeholder="08:00-18:00"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                    value={formData.operating_hours}
                    onChange={(e) =>
                      handleInputChange("operating_hours", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    handleInputChange("status", value)
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Materials */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-emerald-400">
                Materials Accepted *
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {materialOptions.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={material}
                      checked={selectedMaterials.includes(material)}
                      onCheckedChange={() => handleMaterialToggle(material)}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                    <Label
                      htmlFor={material}
                      className="text-sm font-normal capitalize cursor-pointer flex-1"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedMaterials.length === 0 && (
                <p className="text-red-400 text-sm">
                  Please select at least one material type
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-base font-medium"
              disabled={submitting || selectedMaterials.length === 0}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Point...
                </>
              ) : (
                "Create Recycling Point"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PointCard({
  point,
  onDelete,
}: {
  point: RecyclingPoint;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200 hover:border-emerald-500/20 group">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-white group-hover:text-emerald-300 transition-colors">
              {point.name}
            </h3>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                point.status === "active"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}
            >
              {point.status}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-zinc-300 text-sm flex items-center gap-2">
              <MapPin size={16} className="text-emerald-400" />
              {point.address}
            </p>
            <p className="text-zinc-300 text-sm flex items-center gap-2">
              <Clock size={16} className="text-emerald-400" />
              {point.operating_hours}
            </p>
            {point.contact && (
              <p className="text-zinc-300 text-sm flex items-center gap-2">
                <Phone size={16} className="text-emerald-400" />
                {point.contact}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {point.materials.map((material) => (
              <span
                key={material}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize"
              >
                {material}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
            title="Delete point"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    yellow: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    red: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <Card
      className={`bg-white/5 border ${colorMap[color]} backdrop-blur-md transition-all duration-300 hover:scale-105`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-300 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorMap[color].split(" ")[1]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
