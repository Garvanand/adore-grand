import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const body = await req.json();

    const { name, phone, tower, flatNumber } = body;
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone number are required for security officer creation." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let cleanPhone = phone.trim();
    if (!cleanPhone.startsWith("+91")) {
      cleanPhone = "+91" + cleanPhone.replace(/^91/, "");
    }

    const existing = await User.findOne({ phone: cleanPhone });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Phone number ${cleanPhone} is already registered.` },
        { status: 400 }
      );
    }

    const guardUser = await User.create({
      phone: cleanPhone,
      name,
      role: "security",
      tower: tower || "Main Gate",
      flatNumber: flatNumber || "Gate 1",
      isVerified: true,
      status: "active",
    });

    await recordAuditLog({
      actorId: session.userId,
      action: "SECURITY_USER_CREATED",
      targetType: "user",
      targetId: guardUser._id.toString(),
      details: { name, phone: cleanPhone },
    });

    return NextResponse.json({
      success: true,
      message: "Security Guard user account created successfully.",
      user: {
        id: guardUser._id.toString(),
        name: guardUser.name,
        phone: guardUser.phone,
        role: guardUser.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create security guard user" },
      { status: 400 }
    );
  }
}
