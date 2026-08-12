import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { ResidentQuickLoginSchema } from "@/lib/validators";
import { normalizePlateNumber, formatPlateNumber } from "@/lib/utils";
import { signToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // Rate Limit Login Requests (Max 10 per 5 mins per IP)
    const limit = checkRateLimit("auth", ip, 10, 5 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = ResidentQuickLoginSchema.parse(body);

    await connectToDatabase();

    // 1. Phone Normalization
    let cleanPhone = parsed.phone.trim().replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "+91" + cleanPhone;
    } else if (!cleanPhone.startsWith("+")) {
      cleanPhone = "+" + cleanPhone;
    }

    // 2. Plate Normalization
    const normPlate = normalizePlateNumber(parsed.plateNumber);
    const displayPlate = formatPlateNumber(parsed.plateNumber);

    // 3. Find or Create Resident User
    let user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      user = await User.create({
        phone: cleanPhone,
        name: parsed.name.trim(),
        role: "resident",
        tower: parsed.tower,
        flatNumber: parsed.flatNumber.trim(),
        isVerified: true,
        status: "active",
      });
    } else {
      user.name = parsed.name.trim();
      user.tower = parsed.tower;
      user.flatNumber = parsed.flatNumber.trim();
      user.isVerified = true;
      await user.save();
    }

    // 4. Register/Update Car Details under Resident
    let vehicle = await Vehicle.findOne({ plateNumber: normPlate });
    if (!vehicle) {
      vehicle = await Vehicle.create({
        plateNumber: normPlate,
        rawPlateNumber: displayPlate,
        ownerId: user._id,
        vehicleType: parsed.vehicleType || "car",
        makeModel: parsed.makeModel?.trim() || "Resident Car",
        color: "Not Specified",
        tower: parsed.tower,
        flatNumber: parsed.flatNumber.trim(),
        parkingSlot: `${parsed.tower}-${parsed.flatNumber}`,
        parkingZone: parsed.tower,
        status: "active",
      });
    } else {
      vehicle.ownerId = user._id;
      vehicle.tower = parsed.tower;
      vehicle.flatNumber = parsed.flatNumber.trim();
      if (parsed.makeModel?.trim()) {
        vehicle.makeModel = parsed.makeModel.trim();
      }
      await vehicle.save();
    }

    // 5. Generate Signed Session JWT Cookie
    const token = await signToken({
      userId: user._id.toString(),
      phone: user.phone,
      role: user.role,
      name: user.name,
      tower: user.tower,
      flatNumber: user.flatNumber,
      isVerified: true,
    });

    await recordAuditLog({
      actorId: user._id.toString(),
      action: "RESIDENT_QUICK_LOGIN",
      targetType: "user",
      targetId: user._id.toString(),
      details: { plateNumber: normPlate, tower: parsed.tower, flatNumber: parsed.flatNumber },
      ipAddress: ip,
    });

    const response = NextResponse.json({
      success: true,
      message: "Resident signed in successfully.",
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        role: user.role,
        tower: user.tower,
        flatNumber: user.flatNumber,
      },
      registeredVehicle: {
        plateNumber: normPlate,
        rawPlateNumber: displayPlate,
        makeModel: vehicle.makeModel,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to sign in resident." },
      { status: 400 }
    );
  }
}
