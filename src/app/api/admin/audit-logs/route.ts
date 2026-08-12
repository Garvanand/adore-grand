import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AuditLog } from "@/lib/models/AuditLog";
import { requireRole } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireRole(["admin", "super_admin"]);
    await connectToDatabase();

    const logs = await AuditLog.find({})
      .populate("actorId", "name phone role tower flatNumber")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const results = logs.map((log: any) => ({
      id: log._id.toString(),
      actor: log.actorId ? {
        id: log.actorId._id.toString(),
        name: log.actorId.name,
        role: log.actorId.role,
        tower: log.actorId.tower,
        flatNumber: log.actorId.flatNumber,
      } : { name: "System" },
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId ? log.targetId.toString() : null,
      details: log.details || {},
      ipAddress: log.ipAddress,
      createdAt: log.createdAt,
    }));

    return NextResponse.json({ success: true, count: results.length, logs: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Forbidden" },
      { status: 403 }
    );
  }
}
