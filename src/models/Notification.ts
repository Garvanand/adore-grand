import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotificationDocument extends Document {
  recipientId: mongoose.Types.ObjectId;
  senderId?: mongoose.Types.ObjectId;
  type: "move_request" | "incident_escalated" | "incident_resolved" | "account_verified";
  title: string;
  message: string;
  incidentId?: mongoose.Types.ObjectId;
  vehicleId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient user reference is required"],
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: {
        values: ["move_request", "incident_escalated", "incident_resolved", "account_verified"],
        message: "Invalid notification type",
      },
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    incidentId: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast retrieval of unread notifications for a user
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification: Model<INotificationDocument> =
  mongoose.models.Notification || mongoose.model<INotificationDocument>("Notification", NotificationSchema);

export default Notification;
