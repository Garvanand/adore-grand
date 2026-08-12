import { z } from "zod";

export const PhoneLoginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^(\+91|91)?[0-9]{10}$/, "Invalid Indian phone number format"),
});

export const VerifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6, "OTP must be 6 digits"),
  name: z.string().optional(),
  tower: z.string().optional(),
  flatNumber: z.string().optional(),
});

export const DevLoginSchema = z.object({
  role: z.enum(['resident', 'security', 'admin', 'super_admin']),
  tower: z.string().optional(),
  flatNumber: z.string().optional(),
});

export const VehicleSearchSchema = z.object({
  plateNumber: z.string().min(2, "Plate number query too short"),
});

export const RegisterVehicleSchema = z.object({
  plateNumber: z.string().min(3, "Valid registration plate required"),
  vehicleType: z.enum(['car', 'bike', 'ev', 'commercial']),
  makeModel: z.string().min(2, "Make & Model description required"),
  tower: z.string().min(1, "Tower required"),
  flatNumber: z.string().min(1, "Flat number required"),
  parkingSlot: z.string().optional(),
  stickerId: z.string().optional(),
});

export const CreateMoveRequestSchema = z.object({
  plateNumber: z.string().min(3),
  vehicleId: z.string().optional(),
  location: z.string().min(3, "Location description required e.g. Basement 1 near Pillar B-12"),
  description: z.string().optional(),
  priority: z.enum(['normal', 'urgent']).default('normal'),
});

export const EscalateIncidentSchema = z.object({
  incidentId: z.string().min(1),
  reason: z.string().min(3, "Escalation reason required"),
});

export const ResolveIncidentSchema = z.object({
  incidentId: z.string().min(1),
  resolutionNote: z.string().min(2, "Resolution note required"),
});

export const UpdateUserSchema = z.object({
  userId: z.string().min(1),
  isVerified: z.boolean().optional(),
  role: z.enum(['resident', 'security', 'admin', 'super_admin']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
});
