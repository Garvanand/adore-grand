import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vehicle } from "@/models/Vehicle";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["admin", "super_admin"]);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const vehicleType = searchParams.get("type") || "";

    await connectToDatabase();

    const query: any = {};
    if (search.trim()) {
      const norm = search.replace(/[^a-zA-Z0-9]/g, "");
      query.$or = [
        { plateNumber: { $regex: norm, $options: "i" } },
        { makeModel: { $regex: search, $options: "i" } },
        { tower: { $regex: search, $options: "i" } },
        { flatNumber: { $regex: search, $options: "i" } },
      ];
    }
    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    const skip = (page - 1) * limit;

    const totalCount = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .populate("ownerId", "name phone tower flatNumber isVerified")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const results = vehicles.map((v: any) => ({
      id: v._id.toString(),
      plateNumber: v.plateNumber,
      rawPlateNumber: v.rawPlateNumber,
      vehicleType: v.vehicleType,
      makeModel: v.makeModel,
      tower: v.tower,
      flatNumber: v.flatNumber,
      parkingSlot: v.parkingSlot,
      stickerId: v.stickerId,
      status: v.status,
      owner: v.ownerId ? {
        id: v.ownerId._id.toString(),
        name: v.ownerId.name,
        phone: v.ownerId.phone,
        tower: v.ownerId.tower,
        flatNumber: v.ownerId.flatNumber,
      } : null,
      createdAt: v.createdAt,
    }));

    return NextResponse.json({
      success: true,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      vehicles: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Forbidden" },
      { status: 403 }
    );
  }
}
