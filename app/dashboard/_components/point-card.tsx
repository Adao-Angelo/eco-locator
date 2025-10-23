import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Trash2 } from "lucide-react";

export default function PointCard({
  point,
  onDelete,
}: {
  point: any;
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
