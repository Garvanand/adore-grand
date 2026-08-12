import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";

interface CreateAuditParams {
  actorId: string;
  action: string;
  targetType: "vehicle" | "incident" | "user" | "auth" | "system";
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

export async function recordAuditLog(params: CreateAuditParams): Promise<void> {
  try {
    await connectToDatabase();
    await AuditLog.create({
      actorId: params.actorId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      details: params.details || {},
      ipAddress: params.ipAddress || "127.0.0.1",
    });
  } catch (error) {
    console.error("[AUDIT LOG ERROR] Failed to record audit log:", error);
  }
}
