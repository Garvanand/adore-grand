import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParkingZone extends Document {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ParkingZoneSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ParkingZone: Model<IParkingZone> =
  mongoose.models.ParkingZone || mongoose.model<IParkingZone>("ParkingZone", ParkingZoneSchema);
