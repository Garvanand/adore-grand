import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Incident } from "@/models/Incident";
import { User } from "@/models/User";
import { Notification } from "@/models/Notification";
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
    const body = await req.json().catch(() => ({}));
    
    const reason = body.reason || "Owner unresponsive after nudge. Escalated to Gate 1 Duty Security.";

    await connectToDatabase();

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return NextResponse.json(
        { success: false, message: "Incident record not found" },
        { status: 404 }
      );
    }

    incident.status = "ESCALATED";
    incident.priority = "urgent";
    incident.timeline.push({
      timestamp: new Date(),
      status: "ESCALATED",
      updatedBy: session.userId as any,
      note: `Escalated by ${session.name}: ${reason}`,
    });

    await incident.save();

    // Find on-duty Security Officers and notify them
    const securityGuards = await User.find({ role: "security" });
    for (const guard of securityGuards) {
      await Notification.create({
        recipientId: guard._id,
        senderId: session.userId,
        type: "incident_escalated",
        title: `🔴 ESCALATION ALERT: ${incident.incidentNumber}`,
        message: `Vehicle ${incident.plateNumber} blocking ${incident.location}. Gate 1 Guard Action Required!`,
        incidentId: incident._id,
      });
    }

    await recordAuditLog({
      actorId: session.userId,
      action: "INCIDENT_ESCALATED",
      targetType: "incident",
      targetId: incidentId,
      details: { reason, status: "ESCALATED" },
    });

    return NextResponse.json({
      success: true,
      message: "Incident successfully escalated to Gate Security on duty.",
      incident: {
        id: incident._id.toString(),
        status: incident.status,
        priority: incident.priority,
        timeline: incident.timeline,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Escalation failed" },
      { status: 400 }
    );
  }
}
