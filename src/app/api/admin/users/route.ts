import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { requireRole } from "@/lib/auth/session";
import { UpdateUserSchema } from "@/lib/validators";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    await connectToDatabase();

    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    const results = users.map((u: any) => ({
      id: u._id.toString(),
      phone: u.phone,
      name: u.name,
      role: u.role,
      tower: u.tower,
      flatNumber: u.flatNumber,
      isVerified: u.isVerified,
      status: u.status,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, count: results.length, users: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Forbidden" },
      { status: 403 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const body = await req.json();
    const parsed = UpdateUserSchema.parse(body);

    await connectToDatabase();

    const user = await User.findById(parsed.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (typeof parsed.isVerified === "boolean") user.isVerified = parsed.isVerified;
    if (parsed.role) user.role = parsed.role;
    if (parsed.status) user.status = parsed.status;

    await user.save();

    await recordAuditLog({
      actorId: session.userId,
      action: "USER_UPDATED",
      targetType: "user",
      targetId: parsed.userId,
      details: { role: parsed.role, isVerified: parsed.isVerified, status: parsed.status },
    });

    return NextResponse.json({
      success: true,
      message: "User profile updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Update failed" },
      { status: 400 }
    );
  }
}
