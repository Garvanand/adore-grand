import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vehicle } from "@/models/Vehicle";
import { requireAuth } from "@/lib/auth/session";
import { RegisterVehicleSchema } from "@/lib/validators";
import { normalizePlateNumber, formatPlateNumber } from "@/lib/utils";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    // If resident, fetch their vehicles. If admin/security, fetch all.
    const query = session.role === "resident" ? { ownerId: session.userId } : {};
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 }).lean();

    const results = vehicles.map((v: any) => ({
      id: v._id.toString(),
      plateNumber: v.plateNumber,
      rawPlateNumber: v.rawPlateNumber || formatPlateNumber(v.plateNumber),
      vehicleType: v.vehicleType,
      makeModel: v.makeModel,
      tower: v.tower,
      flatNumber: v.flatNumber,
      parkingSlot: v.parkingSlot,
      stickerId: v.stickerId,
      status: v.status,
      createdAt: v.createdAt,
    }));

    return NextResponse.json({ success: true, count: results.length, vehicles: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch vehicles" },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = RegisterVehicleSchema.parse(body);

    await connectToDatabase();

    const normPlate = normalizePlateNumber(parsed.plateNumber);

    // Check if plate already registered
    const existing = await Vehicle.findOne({ plateNumber: normPlate });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Vehicle number ${normPlate} is already registered.` },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.create({
      plateNumber: normPlate,
      rawPlateNumber: formatPlateNumber(normPlate),
      vehicleType: parsed.vehicleType,
      makeModel: parsed.makeModel,
      ownerId: session.userId,
      tower: parsed.tower || session.tower,
      flatNumber: parsed.flatNumber || session.flatNumber,
      parkingSlot: parsed.parkingSlot || `Slot ${session.tower}-${session.flatNumber}`,
      stickerId: parsed.stickerId || `AG-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "active",
    });

    await recordAuditLog({
      actorId: session.userId,
      action: "REGISTER_VEHICLE",
      targetType: "vehicle",
      targetId: (vehicle._id as any).toString(),
      details: { plateNumber: normPlate, tower: parsed.tower, flatNumber: parsed.flatNumber },
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle registered successfully",
      vehicle: {
        id: (vehicle._id as any).toString(),
        plateNumber: vehicle.plateNumber,
        rawPlateNumber: vehicle.rawPlateNumber,
        vehicleType: vehicle.vehicleType,
        makeModel: vehicle.makeModel,
        tower: vehicle.tower,
        flatNumber: vehicle.flatNumber,
        parkingSlot: vehicle.parkingSlot,
        stickerId: vehicle.stickerId,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to register vehicle" },
      { status: 400 }
    );
  }
}
