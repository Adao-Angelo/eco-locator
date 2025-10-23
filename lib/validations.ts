import { z } from "zod";

export const recyclingPointSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(1, "Address is required"),
  materials: z.array(
    z.enum(["plastic", "glass", "electronics", "paper", "metal", "batteries"])
  ),
  operating_hours: z.string().min(1, "Operating hours are required"),
  contact: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
