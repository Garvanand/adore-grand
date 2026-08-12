import { z } from "zod";

export const ResidentQuickLoginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tower: z.enum(["T1", "T2", "T3", "T4", "T5", "T6", "T7", "MANDIR", "PARK_BOUNDARY", "OTHER"]),
  flatNumber: z.string().min(1, "Flat number is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  plateNumber: z.string().min(4, "Vehicle registration plate is required"),
  makeModel: z.string().optional(),
  vehicleType: z.enum(["car", "bike", "scooter", "other"]).optional().default("car"),
});

export const DevLoginSchema = z.object({
  role: z.enum(["resident", "security", "admin", "super_admin"]),
  name: z.string().optional(),
  tower: z.string().optional(),
  flatNumber: z.string().optional(),
});

export const PhoneLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const VerifyOtpSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const RegisterVehicleSchema = z.object({
  plateNumber: z.string().min(4, "Vehicle plate number is required"),
  vehicleType: z.enum(["car", "bike", "scooter", "other"]),
  makeModel: z.string().min(2, "Make & Model is required"),
  color: z.string().optional(),
  tower: z.string().min(1, "Tower is required"),
  flatNumber: z.string().min(1, "Flat number is required"),
  parkingSlot: z.string().optional(),
  parkingZone: z.string().optional(),
  stickerId: z.string().optional(),
});

export const CreateVehicleSchema = RegisterVehicleSchema;

export const UpdateUserSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  status: z.enum(["active", "pending", "suspended"]).optional(),
  role: z.enum(["resident", "security", "admin", "super_admin"]).optional(),
  isVerified: z.boolean().optional(),
});

export const CreateMoveRequestSchema = z.object({
  plateNumber: z.string().min(4, "Vehicle plate number is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().optional(),
  priority: z.enum(["normal", "urgent"]).optional().default("normal"),
});
