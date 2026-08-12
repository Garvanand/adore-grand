import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Incident } from "@/models/Incident";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["admin", "super_admin"]);
    await connectToDatabase();

    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "Incident ID",
      "Vehicle Plate",
      "Tower",
      "Flat Number",
      "Location",
      "Status",
      "Reported At",
      "Updated At",
    ];

    const rows = incidents.map((inc: any) => [
      `"${inc._id.toString()}"`,
      `"${inc.plateNumber || ""}"`,
      `"${inc.tower || ""}"`,
      `"${inc.flatNumber || ""}"`,
      `"${inc.location || ""}"`,
      `"${inc.status || "OPEN"}"`,
      `"${inc.createdAt ? new Date(inc.createdAt).toISOString() : ""}"`,
      `"${inc.updatedAt ? new Date(inc.updatedAt).toISOString() : ""}"`,
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="AdorePark_Incidents_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 403 });
  }
}
