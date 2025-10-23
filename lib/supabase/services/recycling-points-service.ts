import { createClient } from "../client";
import { Database } from "../database.types";

type RecyclingPoint = Database["public"]["Tables"]["recycling_points"]["Row"];
type NewRecyclingPoint =
  Database["public"]["Tables"]["recycling_points"]["Insert"];
type UpdateRecyclingPoint =
  Database["public"]["Tables"]["recycling_points"]["Update"];

export class RecyclingPointsService {
  static async getAllPoints(): Promise<RecyclingPoint[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("recycling_points")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching points:", error);
      throw error;
    }

    return data || [];
  }

  static async createPoint(point: NewRecyclingPoint): Promise<RecyclingPoint> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("recycling_points")
      .insert([point])
      .select()
      .single();

    if (error) {
      console.error("Error creating point:", error);
      throw error;
    }

    return data;
  }

  static async deletePoint(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from("recycling_points")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting point:", error);
      throw error;
    }
  }

  static async updatePoint(
    id: string,
    updates: UpdateRecyclingPoint
  ): Promise<RecyclingPoint> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("recycling_points")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating point:", error);
      throw error;
    }

    return data;
  }

  static async getFilteredPoints(filters: {
    search?: string;
    material?: string;
    status?: string;
  }) {
    const supabase = createClient();

    let query = supabase.from("recycling_points").select("*");

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
      );
    }

    if (filters.material && filters.material !== "all") {
      query = query.contains("materials", [filters.material]);
    }

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching filtered points:", error);
      throw error;
    }

    return data || [];
  }
}
