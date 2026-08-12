import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Notification } from "@/lib/models/Notification";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    const notifications = await Notification.find({ recipientId: session.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipientId: session.userId,
      isRead: false,
    });

    const results = notifications.map((n: any) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      message: n.message,
      incidentId: n.incidentId ? n.incidentId.toString() : null,
      vehicleId: n.vehicleId ? n.vehicleId.toString() : null,
      isRead: n.isRead,
      createdAt: n.createdAt,
    }));

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch notifications" },
      { status: 401 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    await Notification.updateMany(
      { recipientId: session.userId, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true, message: "Notifications marked as read" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update notifications" },
      { status: 400 }
    );
  }
}
