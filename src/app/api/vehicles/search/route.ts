import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vehicle } from "@/models/Vehicle";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth/session";
import { normalizePlateNumber, maskPhoneNumber } from "@/lib/utils";
import { recordAuditLog } from "@/lib/audit";
import { checkRateLimit, sanitizeRegexQuery } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // 1. Search Rate Limiter (Max 10 searches per minute per IP to prevent enumeration)
    const rateLimit = checkRateLimit("search", ip, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Rate limit exceeded. Please wait a minute before searching again.",
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("plateNumber");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Vehicle plate query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // 2. Prevent wildcards / regex injection
    const cleanQuery = sanitizeRegexQuery(query.trim());
    const normQuery = normalizePlateNumber(cleanQuery);

    if (!normQuery || normQuery.length < 2) {
      return NextResponse.json(
        { success: false, message: "Invalid search query" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 3. Perform query with safe regex matching
    let vehicles = await Vehicle.find({
      plateNumber: { $regex: normQuery, $options: "i" },
    })
      .populate("ownerId", "name phone role tower flatNumber isVerified")
      .limit(5) // Cap results to prevent database enumeration dumps
      .lean();

    const session = await getSession();
    const callerRole = session?.role || "resident";
    const callerId = session?.userId;

    if (session?.userId) {
      await recordAuditLog({
        actorId: session.userId,
        action: "VEHICLE_SEARCH",
        targetType: "vehicle",
        details: { query: normQuery, matchedCount: vehicles.length },
        ipAddress: ip,
      });
    }

    // 4. Privacy Masking Guarantee: Phone numbers are masked for regular residents
    const formattedVehicles = vehicles.map((v: any) => {
      const owner = v.ownerId || {};
      const isSelfOwner = callerId && owner._id && owner._id.toString() === callerId;
      const canViewFullPhone =
        callerRole === "security" || callerRole === "admin" || callerRole === "super_admin" || isSelfOwner;

      return {
        id: v._id.toString(),
        plateNumber: v.plateNumber,
        rawPlateNumber: v.rawPlateNumber || v.plateNumber,
        vehicleType: v.vehicleType,
        makeModel: v.makeModel,
        tower: v.tower,
        flatNumber: v.flatNumber,
        parkingSlot: v.parkingSlot || "Not Assigned",
        stickerId: v.stickerId || "N/A",
        status: v.status,
        owner: {
          id: owner._id ? owner._id.toString() : null,
          name: owner.name || "Adore Resident",
          tower: owner.tower || v.tower,
          flatNumber: owner.flatNumber || v.flatNumber,
          phone: canViewFullPhone ? owner.phone : maskPhoneNumber(owner.phone || ""),
          phoneMasked: maskPhoneNumber(owner.phone || ""),
          isPhonePublic: canViewFullPhone,
        },
      };
    });

    return NextResponse.json({
      success: true,
      query,
      count: formattedVehicles.length,
      results: formattedVehicles,
    });
  } catch (error: any) {
    // 5. Safe Database Error Handling (Never leak MongoDB internals)
    return NextResponse.json(
      { success: false, message: "Search service temporarily unavailable." },
      { status: 500 }
    );
  }
}
