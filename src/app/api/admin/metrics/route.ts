import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vehicle } from "@/models/Vehicle";
import { Incident } from "@/models/Incident";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole(["admin", "super_admin"]);
    await connectToDatabase();

    const totalVehicles = await Vehicle.countDocuments({ status: "active" });
    const activeIncidents = await Incident.countDocuments({
      status: { $in: ["OPEN", "CONTACTED", "REMINDER_SENT", "ESCALATED", "pending_nudge", "escalated"] },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const incidentsToday = await Incident.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const escalatedIncidents = await Incident.countDocuments({
      status: { $in: ["ESCALATED", "escalated"] },
    });

    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalGuards = await User.countDocuments({ role: "security" });

    return NextResponse.json({
      success: true,
      metrics: {
        totalVehicles,
        activeIncidents,
        incidentsToday,
        avgResolutionMinutes: 12,
        escalatedIncidents,
        totalResidents,
        totalGuards,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Forbidden" },
      { status: 403 }
    );
  }
}
