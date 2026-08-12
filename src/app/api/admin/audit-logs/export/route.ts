import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["admin", "super_admin"]);
    await connectToDatabase();

    const logs = await AuditLog.find()
      .populate("actorId", "name phone role")
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean();

    const headers = [
      "Timestamp",
      "Actor Name",
      "Actor Role",
      "Action",
      "Target Type",
      "Target ID",
      "IP Address",
    ];

    const rows = logs.map((l: any) => {
      const actor = l.actorId || {};
      return [
        `"${l.createdAt ? new Date(l.createdAt).toISOString() : ""}"`,
        `"${actor.name || "System"}"`,
        `"${actor.role || "system"}"`,
        `"${l.action || ""}"`,
        `"${l.targetType || ""}"`,
        `"${l.targetId || ""}"`,
        `"${l.ipAddress || ""}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="AdorePark_AuditLogs_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 403 });
  }
}
