import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

// GET: Secure One-Time Credential Export (Super Admin Only)
export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(["super_admin"]);
    await connectToDatabase();

    // Fetch staff & security users
    const staffUsers = await User.find({
      role: { $in: ["security", "admin", "super_admin"] },
    })
      .select("name username role phone createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const format = req.nextUrl.searchParams.get("format") || "txt";

    await recordAuditLog({
      actorId: session.userId,
      action: "STAFF_CREDENTIAL_EXPORT",
      targetType: "user",
      details: { exportFormat: format, userCount: staffUsers.length },
    });

    if (format === "csv") {
      let csvContent = "Username,Name,Role,Phone,CreatedAt\n";
      for (const u of staffUsers) {
        csvContent += `"${u.username || "N/A"}","${u.name}","${u.role}","${u.phone}","${new Date(u.createdAt).toISOString()}"\n`;
      }

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="adorepark_staff_credentials_export.csv"',
        },
      });
    }

    // Default TXT Format
    let txtContent = "==================================================\n";
    txtContent += "ADOREPARK — OFFICIAL STAFF CREDENTIAL EXPORT\n";
    txtContent += "CLASSIFICATION: SUPER ADMIN CONFIDENTIAL\n";
    txtContent += `EXPORTED AT: ${new Date().toISOString()}\n`;
    txtContent += "==================================================\n\n";

    txtContent += "ROLE        | USERNAME             | PHONE          | CREATED AT\n";
    txtContent += "----------------------------------------------------------------------\n";

    for (const u of staffUsers) {
      const rolePad = u.role.padEnd(11, " ");
      const userPad = (u.username || "N/A").padEnd(20, " ");
      const phonePad = u.phone.padEnd(14, " ");
      txtContent += `${rolePad} | ${userPad} | ${phonePad} | ${new Date(u.createdAt).toLocaleDateString()}\n`;
    }

    txtContent += "\n----------------------------------------------------------------------\n";
    txtContent += "Note: Plaintext temporary passwords are shown once upon account provisioning\n";
    txtContent += "and are hashed in MongoDB using PBKDF2 (SHA-512). To reset a lost staff password,\n";
    txtContent += "Super Admin can provision a new temporary credential from the Command Center.\n";

    return new NextResponse(txtContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": 'attachment; filename="adorepark_staff_credentials_export.txt"',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Unauthorized credential export request." },
      { status: 403 }
    );
  }
}
