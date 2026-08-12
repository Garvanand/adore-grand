import mongoose, { Schema, Document, Model } from "mongoose";

export type VehicleType = "car" | "bike" | "ev" | "commercial";

export interface IVehicleDocument extends Document {
  plateNumber: string; // Uppercase normalized without spaces/hyphens e.g. HR26AB1234
  rawPlateNumber: string; // Display plate string e.g. HR 26 AB 1234
  vehicleType: VehicleType;
  makeModel: string;
  ownerId: mongoose.Types.ObjectId;
  tower: string;
  flatNumber: string;
  parkingSlot?: string;
  stickerId?: string;
  photoUrl?: string;
  status: "active" | "unregistered" | "flagged";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Helper utility to normalize vehicle registration numbers.
 * E.g. "HR26 AB 1234"  -> "HR26AB1234"
 * E.g. "hr26ab1234"    -> "HR26AB1234"
 * E.g. "HR-26-AB-1234" -> "HR26AB1234"
 */
export function normalizePlateNumber(plate: string): string {
  if (!plate) return "";
  return plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

const VehicleSchema = new Schema<IVehicleDocument>(
  {
    plateNumber: {
      type: String,
      required: [true, "Vehicle plate number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      set: (v: string) => normalizePlateNumber(v),
    },
    rawPlateNumber: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: {
        values: ["car", "bike", "ev", "commercial"],
        message: "Invalid vehicle type",
      },
      default: "car",
    },
    makeModel: {
      type: String,
      required: [true, "Make and model is required"],
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vehicle owner reference is required"],
      index: true,
    },
    tower: {
      type: String,
      required: true,
      index: true,
    },
    flatNumber: {
      type: String,
      required: true,
      index: true,
    },
    parkingSlot: {
      type: String,
      trim: true,
    },
    stickerId: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "unregistered", "flagged"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to ensure normalized plate number
VehicleSchema.pre("validate", function (next) {
  if (this.plateNumber) {
    this.plateNumber = normalizePlateNumber(this.plateNumber);
  }
  next();
});

// Indexes for fast lookup
VehicleSchema.index({ tower: 1, flatNumber: 1 });
VehicleSchema.index({ ownerId: 1, status: 1 });

export const Vehicle: Model<IVehicleDocument> =
  mongoose.models.Vehicle || mongoose.model<IVehicleDocument>("Vehicle", VehicleSchema);

export default Vehicle;
