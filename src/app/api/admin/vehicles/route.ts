import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vehicle } from "@/models/Vehicle";
import { User } from "@/models/User";
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
    const vehicleType = searchParams.get("type") || "";
    const towerFilter = searchParams.get("tower") || "";
    const statusFilter = searchParams.get("status") || "";

    await connectToDatabase();

    // Force Mongoose model registration
    if (!User) console.log("User initialized");

    const query: any = {};
    if (search.trim()) {
      const norm = search.replace(/[^a-zA-Z0-9]/g, "");
      query.$or = [
        { plateNumber: { $regex: norm || search, $options: "i" } },
        { makeModel: { $regex: search, $options: "i" } },
        { tower: { $regex: search, $options: "i" } },
        { flatNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }
    if (towerFilter) {
      query.tower = towerFilter;
    }
    if (statusFilter) {
      query.status = statusFilter;
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
      rawPlateNumber: v.rawPlateNumber || v.plateNumber,
      vehicleType: v.vehicleType || "car",
      makeModel: v.makeModel || "Vehicle",
      color: v.color || "Not Specified",
      tower: v.tower,
      flatNumber: v.flatNumber,
      parkingSlot: v.parkingSlot || "Not Assigned",
      parkingZone: v.parkingZone || v.tower,
      stickerId: v.stickerId || "N/A",
      status: v.status || "active",
      owner: v.ownerId ? {
        id: v.ownerId._id.toString(),
        name: v.ownerId.name,
        phone: v.ownerId.phone,
        tower: v.ownerId.tower,
        flatNumber: v.ownerId.flatNumber,
        isVerified: v.ownerId.isVerified,
      } : null,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt || v.createdAt,
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const body = await req.json();
    const { vehicleId, action, status, tower, flatNumber, parkingSlot } = body;

    if (!vehicleId) {
      return NextResponse.json(
        { success: false, message: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    if (action === "deactivate") {
      vehicle.status = "unregistered";
    } else if (action === "reactivate") {
      vehicle.status = "active";
    } else if (action === "flag") {
      vehicle.status = "flagged";
    } else if (status) {
      vehicle.status = status;
    }

    if (tower) vehicle.tower = tower;
    if (flatNumber) vehicle.flatNumber = flatNumber;
    if (parkingSlot) vehicle.parkingSlot = parkingSlot;

    await vehicle.save();

    await recordAuditLog({
      actorId: session.userId,
      action: `ADMIN_VEHICLE_${action?.toUpperCase() || "UPDATE"}`,
      targetType: "vehicle",
      targetId: vehicle._id.toString(),
      details: { plateNumber: vehicle.plateNumber, newStatus: vehicle.status },
    });

    return NextResponse.json({
      success: true,
      message: `Vehicle ${vehicle.plateNumber} updated successfully.`,
      vehicle: {
        id: vehicle._id.toString(),
        plateNumber: vehicle.plateNumber,
        status: vehicle.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Action failed" },
      { status: 400 }
    );
  }
}
