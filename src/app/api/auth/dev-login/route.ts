import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { signToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { DevLoginSchema } from "@/lib/validators";
import { seedDatabase } from "@/lib/db/seed";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = DevLoginSchema.parse(body);

    await connectToDatabase();

    // Ensure users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await seedDatabase();
    }

    // Find sample user matching requested role
    let user = await User.findOne({ role: parsed.role }).sort({ createdAt: 1 });

    if (!user) {
      // Fallback create user for requested role
      const phone = parsed.role === "resident" ? "+919876543210" : parsed.role === "security" ? "+919800011122" : "+919999900000";
      user = await User.create({
        phone,
        name: parsed.role === "resident" ? "Vikram Sharma" : parsed.role === "security" ? "Security Duty Guard" : "RWA Admin",
        role: parsed.role,
        tower: parsed.tower || "Tower A",
        flatNumber: parsed.flatNumber || "702",
        isVerified: true,
        status: "active",
      });
    }

    const token = await signToken({
      userId: (user._id as any).toString(),
      phone: user.phone,
      name: user.name,
      role: user.role,
      tower: user.tower,
      flatNumber: user.flatNumber,
      isVerified: user.isVerified,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: (user._id as any).toString(),
        phone: user.phone,
        name: user.name,
        role: user.role,
        tower: user.tower,
        flatNumber: user.flatNumber,
        isVerified: user.isVerified,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Dev login failed" },
      { status: 400 }
    );
  }
}
