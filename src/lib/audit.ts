import { connectToDatabase } from "@/lib/db/mongoose";
import { AuditLog } from "@/lib/models/AuditLog";

interface CreateAuditParams {
  actorId: string;
  action: string;
  targetType: 'vehicle' | 'incident' | 'user';
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
      ipAddress: params.ipAddress || '127.0.0.1',
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}
