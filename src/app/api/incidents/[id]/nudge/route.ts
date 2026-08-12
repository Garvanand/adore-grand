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

    const incident = await Incident.findById(incidentId).populate("ownerId");
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
      note: `Owner contacted via in-app parking move alert by ${session.name}`,
    });

    await incident.save();

    if (incident.ownerId) {
      await Notification.create({
        recipientId: incident.ownerId._id,
        senderId: session.userId,
        type: "move_request",
        title: `🚘 PARKING ALERT: ${incident.plateNumber}`,
        message: `${session.name} (Flat ${session.tower}-${session.flatNumber}) requests you to move vehicle ${incident.plateNumber} at ${incident.location}.`,
        incidentId: incident._id,
      });
    }

    await recordAuditLog({
      actorId: session.userId,
      action: "OWNER_CONTACTED",
      targetType: "incident",
      targetId: incidentId,
      details: { plateNumber: incident.plateNumber, status: "CONTACTED" },
    });

    return NextResponse.json({
      success: true,
      message: "Parking alert sent to owner. Contact attempt logged.",
      incident: {
        id: incident._id.toString(),
        status: incident.status,
        timeline: incident.timeline,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to contact owner" },
      { status: 400 }
    );
  }
}
