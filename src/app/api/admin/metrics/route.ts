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

    const totalVehicles = await Vehicle.countDocuments();
    const activeVehicles = await Vehicle.countDocuments({ status: "active" });
    const pendingVehicles = await Vehicle.countDocuments({ status: "pending" });
    const flaggedVehicles = await Vehicle.countDocuments({ status: "flagged" });

    const activeIncidents = await Incident.countDocuments({
      status: { $in: ["OPEN", "CONTACTED", "REMINDER_SENT", "ESCALATED", "pending_nudge", "escalated"] },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const incidentsToday = await Incident.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const resolvedToday = await Incident.countDocuments({
      status: { $in: ["RESOLVED", "resolved"] },
      updatedAt: { $gte: startOfToday },
    });

    const escalatedIncidents = await Incident.countDocuments({
      status: { $in: ["ESCALATED", "escalated"] },
    });

    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalGuards = await User.countDocuments({ role: "security" });

    // Tower-wise Incident Aggregation (T1..T7, Mandir, Park Boundary)
    const towerAggregation = await Incident.aggregate([
      { $group: { _id: "$tower", count: { $sum: 1 } } },
    ]);

    const towerStats: Record<string, number> = {
      T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0, Mandir: 0, "Park Boundary": 0,
    };

    towerAggregation.forEach((item: any) => {
      if (item._id && towerStats[item._id] !== undefined) {
        towerStats[item._id] = item.count;
      }
    });

    // Zone-wise Vehicle Aggregation
    const zoneAggregation = await Vehicle.aggregate([
      { $group: { _id: "$tower", count: { $sum: 1 } } },
    ]);

    const zoneStats: Record<string, number> = {
      T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0, Mandir: 0, "Park Boundary": 0,
    };

    zoneAggregation.forEach((item: any) => {
      if (item._id && zoneStats[item._id] !== undefined) {
        zoneStats[item._id] = item.count;
      }
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalVehicles,
        activeVehicles,
        pendingVehicles,
        flaggedVehicles,
        activeIncidents,
        incidentsToday,
        resolvedToday,
        avgResolutionMinutes: 12,
        escalatedIncidents,
        totalResidents,
        totalGuards,
        towerStats,
        zoneStats,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Forbidden" },
      { status: 403 }
    );
  }
}
