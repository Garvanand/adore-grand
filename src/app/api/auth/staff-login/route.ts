import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // Rate Limit Staff Login (Max 5 attempts per 10 mins)
    const limit = checkRateLimit("auth", ip, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please wait 10 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanUsername = username.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ username: cleanUsername }, { username: username.trim() }],
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Account suspended or inactive." },
        { status: 403 }
      );
    }

    const token = await signToken({
      userId: user._id.toString(),
      phone: user.phone,
      role: user.role,
      name: user.name,
      tower: user.tower,
      flatNumber: user.flatNumber,
      isVerified: user.isVerified,
    });

    await recordAuditLog({
      actorId: user._id.toString(),
      action: "STAFF_LOGIN_SUCCESS",
      targetType: "user",
      targetId: user._id.toString(),
      ipAddress: ip,
    });

    const response = NextResponse.json({
      success: true,
      message: "Staff authentication successful.",
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        tower: user.tower,
        flatNumber: user.flatNumber,
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
      { success: false, message: error.message || "Authentication service error." },
      { status: 500 }
    );
  }
}
