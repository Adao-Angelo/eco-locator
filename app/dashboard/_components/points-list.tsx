"use client";

import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { RecyclingPointsService } from "@/lib/supabase/services/recycling-points-service";
import { Clock, MapPin, Phone, Plus, Trash2 } from "lucide-react";

interface PointsListProps {
  filteredPoints: any[];
  allPointsCount: number;
}

function PointCard({ point, onDelete }: { point: any; onDelete: () => void }) {
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
            {point.materials.map((material: string) => (
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

export default function PointsList({
  filteredPoints,
  allPointsCount,
}: PointsListProps) {
  const { setOpenModal, removeRecyclingPoint } = useDashboardStore();

  const handleDeletePoint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recycling point?")) {
      return;
    }

    try {
      await RecyclingPointsService.deletePoint(id);
      removeRecyclingPoint(id);
    } catch (error) {
      console.error("Error deleting point:", error);
      alert("Error deleting recycling point. Please try again.");
    }
  };

  return (
    <section className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recycling Points</h2>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm">
            Showing {filteredPoints.length} of {allPointsCount} points
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
              Get started by adding your first recycling point
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
  );
}
