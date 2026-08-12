import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  category?: "parking" | "maintenance" | "general" | "urgent";
  postedBy: string;
  isPinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["parking", "maintenance", "general", "urgent"],
      default: "general",
    },
    postedBy: { type: String, required: true, default: "RWA Super Admin" },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
