"use client";

import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { RecyclingPointsService } from "@/lib/supabase/services/recycling-points-service";
import { MapPin, Plus } from "lucide-react";
import PointCard from "./point-card";

interface PointsListProps {
  filteredPoints: any[];
  allPointsCount: number;
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
