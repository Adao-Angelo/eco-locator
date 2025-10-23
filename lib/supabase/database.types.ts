export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      recycling_points: {
        Row: {
          id: string;
          name: string;
          latitude: number;
          longitude: number;
          address: string;
          materials: string[];
          operating_hours: string;
          contact: string | null;
          status: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          latitude: number;
          longitude: number;
          address: string;
          materials: string[];
          operating_hours: string;
          contact?: string | null;
          status?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          materials?: string[];
          operating_hours?: string;
          contact?: string | null;
          status?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
