"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, BarChart3, MapPin, Users } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    materialTypes: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      title: "Total Points",
      value: stats.total,
      icon: <MapPin className="w-5 h-5" />,
      color: "emerald" as const,
    },
    {
      title: "Active Points",
      value: stats.active,
      icon: <Activity className="w-5 h-5" />,
      color: "blue" as const,
    },
    {
      title: "Material Types",
      value: stats.materialTypes,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "yellow" as const,
    },
    {
      title: "Inactive Points",
      value: stats.inactive,
      icon: <Users className="w-5 h-5" />,
      color: "red" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
        />
      ))}
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
  color: "emerald" | "blue" | "yellow" | "red";
}) {
  const colorMap = {
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
