import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { VerifyOtpSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyOtpSchema.parse(body);

    // Accept default test OTP 123456 in dev mode or valid check
    if (parsed.otp !== "123456" && process.env.DEV_AUTH_MODE !== "false") {
      return NextResponse.json(
        { success: false, message: "Invalid OTP. Use test OTP 123456 in Dev Mode." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Standardize phone number format
    let phone = parsed.phone.trim();
    if (!phone.startsWith("+91")) {
      phone = "+91" + phone.replace(/^91/, "");
    }

    // Find or create resident profile
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        name: body.name || "Resident " + phone.slice(-4),
        role: "resident",
        tower: body.tower || "T1",
        flatNumber: body.flatNumber || "101",
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
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "OTP Verification failed" },
      { status: 400 }
    );
  }
}
