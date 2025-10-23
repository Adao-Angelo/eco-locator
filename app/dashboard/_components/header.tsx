"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Plus } from "lucide-react";
import LogoutButton from "./logout-button";

export default function DashboardHeader() {
  const { user, setOpenModal } = useDashboardStore();

  return (
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
  );
}
