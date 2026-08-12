import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { requireRole } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const tower = searchParams.get("tower") || "";

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
    if (tower) {
      query.tower = tower;
    }

    const skip = (page - 1) * limit;

    const totalCount = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Fetch vehicle count per resident
    const userIds = users.map((u: any) => u._id);
    const vehicleCounts = await Vehicle.aggregate([
      { $match: { ownerId: { $in: userIds } } },
      { $group: { _id: "$ownerId", count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    vehicleCounts.forEach((item: any) => {
      if (item._id) countMap[item._id.toString()] = item.count;
    });

    const results = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name,
      phone: u.phone,
      role: u.role,
      tower: u.tower,
      flatNumber: u.flatNumber,
      isVerified: u.isVerified,
      status: u.status || "active",
      vehicleCount: countMap[u._id.toString()] || 0,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt || u.createdAt,
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const body = await req.json();
    const { userId, action, status } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (action === "suspend" || status === "suspended") {
      user.status = "suspended";
    } else if (action === "activate" || status === "active") {
      user.status = "active";
    }

    await user.save();

    await recordAuditLog({
      actorId: session.userId,
      action: `ADMIN_RESIDENT_${user.status.toUpperCase()}`,
      targetType: "user",
      targetId: user._id.toString(),
      details: { name: user.name, phone: user.phone, status: user.status },
    });

    return NextResponse.json({
      success: true,
      message: `User ${user.name} account set to ${user.status}.`,
      user: {
        id: user._id.toString(),
        name: user.name,
        status: user.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Action failed" },
      { status: 400 }
    );
  }
}
