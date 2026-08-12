import mongoose, { Schema, Document, Model } from "mongoose";

export type IncidentStatus =
  | "OPEN"
  | "CONTACTED"
  | "REMINDER_SENT"
  | "ESCALATED"
  | "RESOLVED"
  | "CANCELLED"
  | "pending_nudge"
  | "escalated"
  | "guard_assigned"
  | "resolved"
  | "cancelled";

export type IncidentPriority = "normal" | "urgent";

export interface IIncidentTimeline {
  timestamp: Date;
  status: string;
  updatedBy: mongoose.Types.ObjectId;
  note?: string;
}

export interface IIncidentDocument extends Document {
  incidentNumber: string;
  vehicleId?: mongoose.Types.ObjectId;
  plateNumber: string;
  reportedBy: mongoose.Types.ObjectId;
  ownerId?: mongoose.Types.ObjectId;
  location: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  description?: string;
  imageUrls?: string[];
  resolvedBy?: mongoose.Types.ObjectId;
  resolutionNote?: string;
  timeline: IIncidentTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncidentDocument>(
  {
    incidentNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      index: true,
    },
    plateNumber: {
      type: String,
      required: [true, "Plate number is required for incidents"],
      uppercase: true,
      trim: true,
      index: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporting resident reference is required"],
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    location: {
      type: String,
      required: [true, "Incident blockage location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "OPEN",
        "CONTACTED",
        "REMINDER_SENT",
        "ESCALATED",
        "RESOLVED",
        "CANCELLED",
        "pending_nudge",
        "escalated",
        "guard_assigned",
        "resolved",
        "cancelled",
      ],
      default: "OPEN",
      index: true,
    },
    priority: {
      type: String,
      enum: ["normal", "urgent"],
      default: "normal",
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrls: [
      {
        type: String,
      },
    ],
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolutionNote: {
      type: String,
      trim: true,
    },
    timeline: [
      {
        timestamp: { type: Date, default: Date.now },
        status: { type: String, required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        note: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for rapid query performance
IncidentSchema.index({ status: 1, createdAt: -1 });
IncidentSchema.index({ reportedBy: 1, createdAt: -1 });
IncidentSchema.index({ ownerId: 1, status: 1 });
IncidentSchema.index({ vehicleId: 1, status: 1 });
IncidentSchema.index({ plateNumber: 1, status: 1 });

export const Incident: Model<IIncidentDocument> =
  mongoose.models.Incident || mongoose.model<IIncidentDocument>("Incident", IncidentSchema);

export default Incident;
