import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

function generateRandomPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const bytes = crypto.randomBytes(16);
  let pass = "";
  for (let i = 0; i < 16; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

// POST: Provision 3 Security Guard & 2 Admin cryptographically random accounts
export async function POST() {
  try {
    const session = await requireRole(["super_admin"]);
    await connectToDatabase();

    const createdCredentials: any[] = [];

    // Provision 3 Guards
    for (let i = 1; i <= 3; i++) {
      const username = `AG-Guard-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
      const rawPassword = generateRandomPassword();
      const phone = `+919800099${String(i).padStart(3, "0")}`;

      const user = await User.create({
        username,
        passwordHash: hashPassword(rawPassword),
        phone,
        name: `Gate ${i} Security Guard`,
        role: "security",
        tower: "Gate 1",
        flatNumber: `Security Gate ${i}`,
        isVerified: true,
        status: "active",
      });

      createdCredentials.push({
        id: user._id.toString(),
        role: "security",
        name: user.name,
        username,
        temporaryPassword: rawPassword,
        phone,
        createdAt: user.createdAt,
      });
    }

    // Provision 2 Admins
    for (let i = 1; i <= 2; i++) {
      const username = `AG-Admin-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
      const rawPassword = generateRandomPassword();
      const phone = `+919800088${String(i).padStart(3, "0")}`;

      const user = await User.create({
        username,
        passwordHash: hashPassword(rawPassword),
        phone,
        name: `RWA Executive Admin ${i}`,
        role: "admin",
        tower: "RWA Office",
        flatNumber: `Office ${i}`,
        isVerified: true,
        status: "active",
      });

      createdCredentials.push({
        id: user._id.toString(),
        role: "admin",
        name: user.name,
        username,
        temporaryPassword: rawPassword,
        phone,
        createdAt: user.createdAt,
      });
    }

    await recordAuditLog({
      actorId: session.userId,
      action: "PROVISION_STAFF_CREDENTIALS",
      targetType: "user",
      details: { countGuards: 3, countAdmins: 2 },
    });

    return NextResponse.json({
      success: true,
      exportHeader: "INITIAL CREDENTIAL EXPORT — SUPER ADMIN CONFIDENTIAL",
      message: "Cryptographically random staff credentials generated successfully.",
      credentials: createdCredentials,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Forbidden" },
      { status: 403 }
    );
  }
}
