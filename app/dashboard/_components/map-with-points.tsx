"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface RecyclingPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  materials: string[];
  operating_hours: string;
  contact: string | null;
  status: string;
}

interface MapWithPointsProps {
  points: RecyclingPoint[];
}

export default function MapWithPoints({ points }: MapWithPointsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || points.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-zinc-400 border border-white/10 rounded-lg">
        {points.length === 0 ? "No points to display" : "Loading map..."}
      </div>
    );
  }

  const center: [number, number] = points[0]
    ? [points[0].latitude, points[0].longitude]
    : [-23.5505, -46.6333];

  return (
    <div className="h-80 rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <Marker key={point.id} position={[point.latitude, point.longitude]}>
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-gray-600">{point.address}</p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    <strong>Materials:</strong> {point.materials.join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Hours:</strong> {point.operating_hours}
                  </p>
                  {point.contact && (
                    <p className="text-xs text-gray-500">
                      <strong>Contact:</strong> {point.contact}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        point.status === "active"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {point.status}
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
