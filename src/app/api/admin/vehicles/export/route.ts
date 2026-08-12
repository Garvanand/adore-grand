import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vehicle } from "@/models/Vehicle";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["admin", "super_admin"]);
    await connectToDatabase();

    if (!User) console.log("User model ready");

    const vehicles = await Vehicle.find()
      .populate("ownerId", "name phone tower flatNumber")
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "Plate Number",
      "Raw Plate",
      "Vehicle Type",
      "Make / Model",
      "Color",
      "Owner Name",
      "Owner Phone",
      "Tower",
      "Flat Number",
      "Parking Slot",
      "Status",
      "Registered Date",
    ];

    const rows = vehicles.map((v: any) => {
      const owner = v.ownerId || {};
      return [
        `"${v.plateNumber || ""}"`,
        `"${v.rawPlateNumber || v.plateNumber || ""}"`,
        `"${v.vehicleType || "car"}"`,
        `"${v.makeModel || ""}"`,
        `"${v.color || ""}"`,
        `"${owner.name || "Adore Resident"}"`,
        `"${owner.phone || ""}"`,
        `"${v.tower || owner.tower || ""}"`,
        `"${v.flatNumber || owner.flatNumber || ""}"`,
        `"${v.parkingSlot || ""}"`,
        `"${v.status || "active"}"`,
        `"${v.createdAt ? new Date(v.createdAt).toISOString() : ""}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="AdorePark_Vehicles_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 403 });
  }
}
