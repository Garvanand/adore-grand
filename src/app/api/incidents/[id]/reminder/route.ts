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

    await connectToDatabase();

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return NextResponse.json(
        { success: false, message: "Incident record not found" },
        { status: 404 }
      );
    }

    incident.status = "REMINDER_SENT";
    incident.timeline.push({
      timestamp: new Date(),
      status: "REMINDER_SENT",
      updatedBy: session.userId as any,
      note: `Follow-up reminder sent to vehicle owner by ${session.name}`,
    });

    await incident.save();

    if (incident.ownerId) {
      await Notification.create({
        recipientId: incident.ownerId,
        senderId: session.userId,
        type: "move_request",
        title: `⏰ SECOND REMINDER: Move Vehicle ${incident.plateNumber}`,
        message: `Please move vehicle ${incident.plateNumber} at ${incident.location} as soon as possible.`,
        incidentId: incident._id,
      });
    }

    await recordAuditLog({
      actorId: session.userId,
      action: "REMINDER_SENT",
      targetType: "incident",
      targetId: incidentId,
      details: { plateNumber: incident.plateNumber, status: "REMINDER_SENT" },
    });

    return NextResponse.json({
      success: true,
      message: "Follow-up reminder sent successfully.",
      incident: {
        id: incident._id.toString(),
        status: incident.status,
        timeline: incident.timeline,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send reminder" },
      { status: 400 }
    );
  }
}
