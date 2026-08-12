import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Incident } from "@/models/Incident";
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

    const resolutionNote = body.resolutionNote || "Vehicle moved and parking spot cleared.";

    await connectToDatabase();

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return NextResponse.json(
        { success: false, message: "Incident record not found" },
        { status: 404 }
      );
    }

    incident.status = "RESOLVED";
    incident.resolvedBy = session.userId as any;
    incident.resolutionNote = resolutionNote;
    incident.timeline.push({
      timestamp: new Date(),
      status: "RESOLVED",
      updatedBy: session.userId as any,
      note: `Resolved by ${session.name} (${session.role}): ${resolutionNote}`,
    });

    await incident.save();

    // Send notifications to reporter and owner
    if (incident.reportedBy) {
      const reporterIdStr = incident.reportedBy.toString();
      await Notification.create({
        recipientId: incident.reportedBy,
        senderId: session.userId,
        type: "incident_resolved",
        title: `✅ Incident Resolved: ${incident.incidentNumber}`,
        message: `Issue with vehicle ${incident.plateNumber} at ${incident.location} has been marked resolved.`,
        incidentId: incident._id,
      });

      const { dispatchPushNotificationToUser } = await import("@/lib/push");
      await dispatchPushNotificationToUser(reporterIdStr, {
        title: `✅ Incident Resolved: ${incident.incidentNumber}`,
        body: `Issue with vehicle ${incident.plateNumber} at ${incident.location} has been marked resolved.`,
        url: "/dashboard",
      });
    }

    await recordAuditLog({
      actorId: session.userId,
      action: "INCIDENT_RESOLVED",
      targetType: "incident",
      targetId: incidentId,
      details: { resolutionNote, role: session.role, status: "RESOLVED" },
    });

    return NextResponse.json({
      success: true,
      message: "Incident resolved successfully.",
      incident: {
        id: incident._id.toString(),
        status: incident.status,
        resolutionNote: incident.resolutionNote,
        timeline: incident.timeline,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Resolution failed" },
      { status: 400 }
    );
  }
}
