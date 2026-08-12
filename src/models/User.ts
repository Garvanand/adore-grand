import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name: string;
  role: "resident" | "security" | "admin" | "super_admin";
  tower: string;
  flatNumber: string;
  isVerified: boolean;
  status: "active" | "pending" | "suspended";
  username?: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["resident", "security", "admin", "super_admin"],
      default: "resident",
      index: true,
    },
    tower: { type: String, required: true, index: true },
    flatNumber: { type: String, required: true, index: true },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "active",
    },
    username: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String },
  },
  {
    timestamps: true,
  }
);

// Compound index for flat lookups
UserSchema.index({ tower: 1, flatNumber: 1 });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
