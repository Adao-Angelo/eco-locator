import { Activity, BarChart3, MapPin, Users } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    materialTypes: number;
  };
}
export function getStatItems(stats: StatsCardsProps["stats"]) {
  return [
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
}
