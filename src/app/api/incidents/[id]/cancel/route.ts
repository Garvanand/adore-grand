import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Incident } from "@/models/Incident";
import { requireAuth } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const resolvedParams = await params;
    const incidentId = resolvedParams.id;

    await connectToDatabase();

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return NextResponse.json(
        { success: false, message: "Incident record not found" },
        { status: 404 }
      );
    }

    incident.status = "CANCELLED";
    incident.timeline.push({
      timestamp: new Date(),
      status: "CANCELLED",
      updatedBy: session.userId as any,
      note: `Incident report cancelled by ${session.name}`,
    });

    await incident.save();

    await recordAuditLog({
      actorId: session.userId,
      action: "INCIDENT_CANCELLED",
      targetType: "incident",
      targetId: incidentId,
      details: { plateNumber: incident.plateNumber },
    });

    return NextResponse.json({
      success: true,
      message: "Incident report cancelled.",
      incident: {
        id: incident._id.toString(),
        status: incident.status,
        timeline: incident.timeline,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to cancel incident" },
      { status: 400 }
    );
  }
}
