export type MaterialType =
  | "plastic"
  | "glass"
  | "electronics"
  | "paper"
  | "metal"
  | "batteries";

export interface RecyclingPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  materials: MaterialType[];
  operating_hours: string;
  contact: string;
  status: "active" | "inactive";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: "admin";
  created_at: string;
}
