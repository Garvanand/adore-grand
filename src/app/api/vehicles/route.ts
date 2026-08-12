import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vehicle } from "@/models/Vehicle";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth/session";
import { RegisterVehicleSchema } from "@/lib/validators";
import { normalizePlateNumber, formatPlateNumber } from "@/lib/utils";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const query = session.role === "resident" ? { ownerId: session.userId } : {};
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 }).lean();

    const results = vehicles.map((v: any) => ({
      id: v._id.toString(),
      plateNumber: v.plateNumber,
      rawPlateNumber: v.rawPlateNumber || formatPlateNumber(v.plateNumber),
      vehicleType: v.vehicleType,
      makeModel: v.makeModel,
      color: v.color,
      tower: v.tower,
      flatNumber: v.flatNumber,
      parkingSlot: v.parkingSlot,
      parkingZone: v.parkingZone,
      stickerId: v.stickerId,
      status: v.status,
      createdAt: v.createdAt,
    }));

    return NextResponse.json({ success: true, count: results.length, vehicles: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const parsed = RegisterVehicleSchema.parse(body);

    await connectToDatabase();

    const normPlate = normalizePlateNumber(parsed.plateNumber);

    // 1. Determine Owner User
    let ownerId: string;

    if (session?.userId) {
      ownerId = session.userId;
    } else {
      // Find or create user by phone or flat/name
      let cleanPhone = (parsed.phone || "").trim().replace(/[^0-9]/g, "");
      if (cleanPhone.length === 10) cleanPhone = "+91" + cleanPhone;
      if (!cleanPhone.startsWith("+") && cleanPhone.length > 0) cleanPhone = "+" + cleanPhone;
      if (!cleanPhone) cleanPhone = "+91" + Math.floor(6000000000 + Math.random() * 3999999999);

      let user = await User.findOne({ phone: cleanPhone });
      if (!user) {
        user = await User.create({
          phone: cleanPhone,
          name: (parsed.ownerName || "Resident").trim(),
          role: "resident",
          tower: parsed.tower,
          flatNumber: parsed.flatNumber,
          isVerified: true,
          status: "active",
        });
      }
      ownerId = (user._id as any).toString();
    }

    // 2. Check if plate already registered
    let vehicle = await Vehicle.findOne({ plateNumber: normPlate });
    if (!vehicle) {
      vehicle = await Vehicle.create({
        plateNumber: normPlate,
        rawPlateNumber: formatPlateNumber(normPlate),
        vehicleType: parsed.vehicleType,
        makeModel: parsed.makeModel,
        color: parsed.color || "Not Specified",
        ownerId,
        tower: parsed.tower,
        flatNumber: parsed.flatNumber,
        parkingSlot: parsed.parkingSlot || `${parsed.tower}-${parsed.flatNumber}`,
        parkingZone: parsed.parkingZone || parsed.tower,
        stickerId: parsed.stickerId || `AG-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "active",
      });
    } else {
      vehicle.ownerId = ownerId as any;
      vehicle.makeModel = parsed.makeModel;
      vehicle.color = parsed.color || vehicle.color;
      vehicle.tower = parsed.tower;
      vehicle.flatNumber = parsed.flatNumber;
      await vehicle.save();
    }

    await recordAuditLog({
      actorId: ownerId,
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
