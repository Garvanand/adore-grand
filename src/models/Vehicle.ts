import mongoose, { Schema, Document, Model } from "mongoose";

export type VehicleType = "car" | "bike" | "ev" | "commercial";

export interface IVehicleDocument extends Document {
  plateNumber: string; // Uppercase normalized without spaces/hyphens e.g. HR26AB1234
  rawPlateNumber: string; // Display plate string e.g. HR 26 AB 1234
  vehicleType: VehicleType;
  makeModel: string;
  color?: string;
  ownerId: mongoose.Types.ObjectId;
  tower: string;
  flatNumber: string;
  parkingSlot?: string;
  parkingZone?: string;
  stickerId?: string;
  photoUrl?: string;
  status: "active" | "unregistered" | "flagged";
  createdAt: Date;
  updatedAt: Date;
}

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
      default: "car",
    },
    makeModel: {
      type: String,
      required: [true, "Make and model is required"],
      trim: true,
    },
    color: {
      type: String,
      default: "Not Specified",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
    },
    tower: {
      type: String,
      required: [true, "Tower is required"],
      trim: true,
    },
    flatNumber: {
      type: String,
      required: [true, "Flat number is required"],
      trim: true,
    },
    parkingSlot: {
      type: String,
      trim: true,
    },
    parkingZone: {
      type: String,
      trim: true,
    },
    stickerId: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "unregistered", "flagged"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

VehicleSchema.index({ tower: 1, flatNumber: 1 });
VehicleSchema.index({ ownerId: 1 });

export const Vehicle: Model<IVehicleDocument> =
  mongoose.models.Vehicle || mongoose.model<IVehicleDocument>("Vehicle", VehicleSchema);
