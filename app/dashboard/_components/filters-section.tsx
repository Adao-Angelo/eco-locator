"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Search } from "lucide-react";

const materialOptions = [
  "plastic",
  "glass",
  "electronics",
  "paper",
  "metal",
  "batteries",
];

export default function FiltersSection() {
  const {
    search,
    materialFilter,
    statusFilter,
    setSearch,
    setMaterialFilter,
    setStatusFilter,
  } = useDashboardStore();

  return (
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
          <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
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
          <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
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
  );
}
