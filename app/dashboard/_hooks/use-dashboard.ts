"use client";

import { useDashboardStore } from "@/lib/store/dashboard-store";
import { createClient } from "@/lib/supabase/client";
import { RecyclingPointsService } from "@/lib/supabase/services/recycling-points-service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useDashboard() {
  const router = useRouter();
  const {
    user,
    setUser,
    recyclingPoints,
    setRecyclingPoints,
    loading,
    setLoading,
    search,
    materialFilter,
    statusFilter,
  } = useDashboardStore();

  useEffect(() => {
    loadUserAndPoints();
  }, []);

  const loadUserAndPoints = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const points = await RecyclingPointsService.getAllPoints();
      setRecyclingPoints(points);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const stats = {
    total: recyclingPoints.length,
    active: recyclingPoints.filter((point) => point.status === "active").length,
    inactive: recyclingPoints.filter((point) => point.status === "inactive")
      .length,
    materialTypes: new Set(recyclingPoints.flatMap((point) => point.materials))
      .size,
  };

  const materialCounts = recyclingPoints.reduce((acc, point) => {
    point.materials.forEach((material) => {
      acc[material] = (acc[material] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    user,
    loading,
    filteredPoints,
    stats,
    materialCounts,

    allPoints: recyclingPoints,

    refetch: loadUserAndPoints,
  };
}
