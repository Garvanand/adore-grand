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

    // Ensure User model is registered before populate
    if (!User) console.log("User model initialized");

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
      try {
        await recordAuditLog({
          actorId: session.userId,
          action: "VEHICLE_SEARCH",
          targetType: "vehicle",
          details: { query: normQuery, matchedCount: vehicles.length },
          ipAddress: ip,
        });
      } catch (logErr) {
        console.warn("[AUDIT WARNING] Vehicle search audit failed silently:", logErr);
      }
    }

    // 4. Privacy Masking Guarantee: Phone numbers are masked for regular residents
    const formattedVehicles = vehicles.map((v: any) => {
      const owner = (v.ownerId && typeof v.ownerId === "object") ? v.ownerId : {};
      const ownerIdStr = owner._id ? owner._id.toString() : (v.ownerId ? v.ownerId.toString() : null);
      const isSelfOwner = Boolean(callerId && ownerIdStr && ownerIdStr === callerId);
      const canViewFullPhone =
        callerRole === "security" || callerRole === "admin" || callerRole === "super_admin" || isSelfOwner;

      return {
        id: v._id ? v._id.toString() : "",
        plateNumber: v.plateNumber || "",
        rawPlateNumber: v.rawPlateNumber || v.plateNumber || "",
        vehicleType: v.vehicleType || "car",
        makeModel: v.makeModel || "Vehicle",
        tower: v.tower || owner.tower || "T1",
        flatNumber: v.flatNumber || owner.flatNumber || "101",
        parkingSlot: v.parkingSlot || "Not Assigned",
        stickerId: v.stickerId || "N/A",
        status: v.status || "active",
        owner: {
          id: ownerIdStr,
          name: owner.name || "Adore Resident",
          tower: owner.tower || v.tower || "T1",
          flatNumber: owner.flatNumber || v.flatNumber || "101",
          phone: canViewFullPhone ? (owner.phone || "") : maskPhoneNumber(owner.phone || ""),
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
    console.error("[VEHICLE SEARCH API ERROR]:", error);
    return NextResponse.json(
      { success: false, message: "Search service temporarily unavailable." },
      { status: 500 }
    );
  }
}
