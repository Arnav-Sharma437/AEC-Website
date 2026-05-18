import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export async function POST(request: Request) {
  try {
    const { username, newPassword, secretKey } = await request.json();

    const resetSecret = process.env.ADMIN_RESET_SECRET;
    if (!resetSecret) {
      return NextResponse.json(
        { error: "Password reset is not configured on the server." },
        { status: 503 }
      );
    }

    if (!secretKey || secretKey !== resetSecret) {
      return NextResponse.json({ error: "Invalid reset secret key" }, { status: 403 });
    }

    if (!username?.trim() || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Username and new password (min 6 chars) are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const normalized = username.trim().toLowerCase();
    const admin = await Admin.findOne({ username: normalized });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
