import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// GET: Fetch All Society Announcements
export async function GET() {
  try {
    await connectToDatabase();
    const announcements = await Announcement.find({})
      .sort({ isPinned: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      announcements: announcements.map((a: any) => ({
        id: a._id.toString(),
        title: a.title,
        content: a.content,
        category: a.category || "general",
        postedBy: a.postedBy,
        isPinned: a.isPinned || false,
        createdAt: a.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch announcements." },
      { status: 500 }
    );
  }
}

// POST: Create Announcement (Super Admin Only)
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["super_admin"]);
    await connectToDatabase();

    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, message: "Title and Content are required." },
        { status: 400 }
      );
    }

    const newAnnouncement = await Announcement.create({
      title: body.title.trim(),
      content: body.content.trim(),
      category: body.category || "general",
      postedBy: session.name || "RWA Super Admin",
      isPinned: body.isPinned || false,
    });

    return NextResponse.json({
      success: true,
      message: "Announcement posted successfully to society portal.",
      announcement: {
        id: newAnnouncement._id.toString(),
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        category: newAnnouncement.category,
        postedBy: newAnnouncement.postedBy,
        createdAt: newAnnouncement.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Unauthorized to post announcements." },
      { status: 403 }
    );
  }
}
