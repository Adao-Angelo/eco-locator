"use client";

import dynamic from "next/dynamic";

import AddPointModal from "./_components/add-point-modal";
import FiltersSection from "./_components/filters-section";
import DashboardHeader from "./_components/header";
import MaterialsDistribution from "./_components/materials-distribution";
import PointsList from "./_components/points-list";
import StatsCards from "./_components/stats-cards";
import { useDashboard } from "./_hooks/use-dashboard";

const MapWithPoints = dynamic(() => import("./_components/map-with-points"), {
  ssr: false,
  loading: () => (
    <div className="h-80 flex items-center justify-center text-zinc-400 border border-white/10 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  ),
});

export default function DashboardPage() {
  const { user, loading, filteredPoints, stats, materialCounts } =
    useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-950 via-emerald-950 to-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-zinc-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-emerald-950 to-zinc-900 text-white">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12 space-y-8">
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.email?.split("@")[0] || "Admin"}!
          </h2>
          <p className="text-zinc-400 text-lg">
            Manage your recycling points and monitor collection data
          </p>
        </section>

        <StatsCards stats={stats} />

        <FiltersSection />

        <section className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Map Overview</h2>
          <MapWithPoints points={filteredPoints} />
        </section>

        <MaterialsDistribution
          materialCounts={materialCounts}
          totalPoints={stats.total}
        />

        <PointsList
          filteredPoints={filteredPoints}
          allPointsCount={stats.total}
        />
      </main>

      <AddPointModal />
    </div>
  );
}
