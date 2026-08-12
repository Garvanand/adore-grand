import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["admin", "super_admin"]);
    await connectToDatabase();

    const residents = await User.find({ role: "resident" })
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "Resident Name",
      "Phone",
      "Tower",
      "Flat Number",
      "Role",
      "Status",
      "Verified",
      "Created At",
    ];

    const rows = residents.map((u: any) => [
      `"${u.name || ""}"`,
      `"${u.phone || ""}"`,
      `"${u.tower || ""}"`,
      `"${u.flatNumber || ""}"`,
      `"${u.role || "resident"}"`,
      `"${u.status || "active"}"`,
      `"${u.isVerified ? "YES" : "NO"}"`,
      `"${u.createdAt ? new Date(u.createdAt).toISOString() : ""}"`,
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="AdorePark_Residents_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 403 });
  }
}
