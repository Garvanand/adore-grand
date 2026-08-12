import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Incident } from "@/models/Incident";
import { Vehicle } from "@/models/Vehicle";
import { Notification } from "@/models/Notification";
import { requireAuth } from "@/lib/auth/session";
import { CreateMoveRequestSchema } from "@/lib/validators";
import { normalizePlateNumber } from "@/lib/utils";
import { recordAuditLog } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    await connectToDatabase();

    let query: any = {};
    if (status) {
      query.status = status;
    }

    // Filter by role scope
    if (session.role === "resident") {
      query.$or = [{ reportedBy: session.userId }, { ownerId: session.userId }];
    }

    const incidents = await Incident.find(query)
      .populate("reportedBy", "name tower flatNumber phone")
      .populate("ownerId", "name tower flatNumber phone")
      .populate("resolvedBy", "name role")
      .sort({ createdAt: -1 })
      .lean();

    const results = incidents.map((inc: any) => ({
      id: inc._id.toString(),
      incidentNumber: inc.incidentNumber,
      plateNumber: inc.plateNumber,
      location: inc.location,
      status: inc.status,
      priority: inc.priority,
      description: inc.description,
      reportedBy: inc.reportedBy ? {
        id: inc.reportedBy._id.toString(),
        name: inc.reportedBy.name,
        tower: inc.reportedBy.tower,
        flatNumber: inc.reportedBy.flatNumber,
      } : null,
      owner: inc.ownerId ? {
        id: inc.ownerId._id.toString(),
        name: inc.ownerId.name,
        tower: inc.ownerId.tower,
        flatNumber: inc.ownerId.flatNumber,
        phone: inc.ownerId.phone,
      } : null,
      resolvedBy: inc.resolvedBy ? inc.resolvedBy.name : null,
      resolutionNote: inc.resolutionNote,
      timeline: inc.timeline || [],
      createdAt: inc.createdAt,
    }));

    return NextResponse.json({ success: true, count: results.length, incidents: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch incidents" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    
    // Rate Limiting Check (Max 3 incident reports per user in 15 minutes)
    const rateLimit = checkRateLimit("incident", session.userId, 3, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      const minutesRemaining = Math.ceil(rateLimit.resetMs / (60 * 1000));
      return NextResponse.json(
        {
          success: false,
          message: `Too many incident reports. Please wait ${minutesRemaining} minutes before submitting another report.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = CreateMoveRequestSchema.parse(body);

    await connectToDatabase();
    const normPlate = normalizePlateNumber(parsed.plateNumber);

    // Anti-spam duplicate check: prevent active duplicate open incidents for the same plate within 10 minutes
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    const existingOpenIncident = await Incident.findOne({
      plateNumber: normPlate,
      status: { $in: ["OPEN", "CONTACTED", "REMINDER_SENT", "ESCALATED", "pending_nudge", "escalated"] },
      createdAt: { $gte: tenMinsAgo },
    });

    if (existingOpenIncident) {
      return NextResponse.json({
        success: true,
        isExisting: true,
        message: `An active incident (${existingOpenIncident.incidentNumber}) already exists for vehicle ${normPlate}.`,
        incident: {
          id: existingOpenIncident._id.toString(),
          incidentNumber: existingOpenIncident.incidentNumber,
          plateNumber: existingOpenIncident.plateNumber,
          status: existingOpenIncident.status,
          location: existingOpenIncident.location,
        },
      });
    }

    // Look up vehicle if registered
    const vehicle = await Vehicle.findOne({ plateNumber: normPlate }).populate("ownerId");

    const count = await Incident.countDocuments();
    const incidentNumber = `INC-2026-${String(count + 1).padStart(4, "0")}`;

    const newIncident = await Incident.create({
      incidentNumber,
      vehicleId: vehicle ? vehicle._id : undefined,
      plateNumber: normPlate,
      reportedBy: session.userId,
      ownerId: vehicle ? vehicle.ownerId?._id : undefined,
      location: parsed.location,
      status: "OPEN",
      priority: parsed.priority || "normal",
      description: parsed.description || "Parking blockage reported.",
      timeline: [
        {
          timestamp: new Date(),
          status: "OPEN",
          updatedBy: session.userId,
          note: `Incident reported by ${session.name} (Flat ${session.tower}-${session.flatNumber}) at ${parsed.location}`,
        },
      ],
    });

    await recordAuditLog({
      actorId: session.userId,
      action: "INCIDENT_REPORTED",
      targetType: "incident",
      targetId: (newIncident._id as any).toString(),
      details: { plateNumber: normPlate, location: parsed.location },
    });

    // Create notification for the vehicle owner so they see it on their dashboard
    if (vehicle && vehicle.ownerId && (vehicle.ownerId as any)._id) {
      try {
        await Notification.create({
          recipientId: (vehicle.ownerId as any)._id,
          senderId: session.userId,
          type: "move_request",
          title: "🚗 Your Vehicle is Blocking Someone",
          message: `Your vehicle ${normPlate} at ${parsed.location} is blocking another resident. Please move it as soon as possible.`,
          incidentId: newIncident._id,
          vehicleId: vehicle._id,
          isRead: false,
        });
      } catch (notifErr) {
        // Non-critical: log but don't fail the incident creation
        console.error("Failed to create notification:", notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Parking incident created successfully.",
      incident: {
        id: (newIncident._id as any).toString(),
        incidentNumber: newIncident.incidentNumber,
        plateNumber: newIncident.plateNumber,
        status: newIncident.status,
        location: newIncident.location,
        owner: vehicle && vehicle.ownerId ? {
          name: (vehicle.ownerId as any).name,
          tower: (vehicle.ownerId as any).tower,
          flatNumber: (vehicle.ownerId as any).flatNumber,
          phone: (vehicle.ownerId as any).phone,
        } : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to report incident" },
      { status: 400 }
    );
  }
}
