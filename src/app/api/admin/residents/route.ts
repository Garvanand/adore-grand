import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["admin", "super_admin"]);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    await connectToDatabase();

    const query: any = {};
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { tower: { $regex: search, $options: "i" } },
        { flatNumber: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const totalCount = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const results = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name,
      phone: u.phone,
      role: u.role,
      tower: u.tower,
      flatNumber: u.flatNumber,
      isVerified: u.isVerified,
      status: u.status,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      success: true,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      residents: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Forbidden" },
      { status: 403 }
    );
  }
}
