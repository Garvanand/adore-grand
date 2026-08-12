import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PushSubscription } from "@/models/PushSubscription";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { endpoint, keys, deviceName } = body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return NextResponse.json(
        { success: false, message: "Invalid push subscription payload." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userAgent = req.headers.get("user-agent") || "Browser";

    const sub = await PushSubscription.findOneAndUpdate(
      { endpoint },
      {
        userId: session.userId,
        endpoint,
        keys,
        deviceName: deviceName || "Mobile Browser",
        userAgent,
        lastUsedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Web push subscription saved successfully.",
      subscriptionId: sub._id.toString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save push subscription" },
      { status: 400 }
    );
  }
}
