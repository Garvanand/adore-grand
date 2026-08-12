import { NextRequest, NextResponse } from "next/server";
import { PhoneLoginSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // Rate limit OTP dispatch (Max 5 attempts per 10 minutes per IP)
    const limit = checkRateLimit("auth", ip, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please wait 10 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = PhoneLoginSchema.parse(body);

    console.log(`[OTP DISPATCH] Sent 6-digit OTP to ${parsed.phone}. Dev OTP: 123456`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${parsed.phone}. (Dev test OTP: 123456)`,
      devOtpHint: "123456",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send OTP" },
      { status: 400 }
    );
  }
}
