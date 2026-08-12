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

    const action = body.action || "moving"; // "moving" | "checking"
    const noteText =
      action === "moving"
        ? "Owner acknowledged: On my way to move the vehicle now!"
        : "Owner acknowledged: Checking the parking blockage now.";

    await connectToDatabase();

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return NextResponse.json(
        { success: false, message: "Incident record not found" },
        { status: 404 }
      );
    }

    incident.status = "CONTACTED";
    incident.timeline.push({
      timestamp: new Date(),
      status: "CONTACTED",
      updatedBy: session.userId as any,
      note: noteText,
    });

    await incident.save();

    // Notify reporting resident without revealing sensitive phone
    if (incident.reportedBy) {
      await Notification.create({
        recipientId: incident.reportedBy,
        senderId: session.userId,
        type: "move_request",
        title: `✅ Owner Responded: ${incident.plateNumber}`,
        message: `${noteText} (Location: ${incident.location})`,
        incidentId: incident._id,
      });
    }

    await recordAuditLog({
      actorId: session.userId,
      action: "OWNER_ACKNOWLEDGED",
      targetType: "incident",
      targetId: incidentId,
      details: { action, status: "CONTACTED" },
    });

    return NextResponse.json({
      success: true,
      message: "Acknowledgment recorded and reporter notified.",
      incident: {
        id: incident._id.toString(),
        status: incident.status,
        timeline: incident.timeline,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to record acknowledgment" },
      { status: 400 }
    );
  }
}
