import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import {
  ARNAVADMIN_PASSWORD_PLAIN,
  ARNAVADMIN_USERNAME,
} from "@/lib/admin-credentials";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uriSet = Boolean(process.env.MONGODB_URI?.trim());
    if (!uriSet) {
      return NextResponse.json({
        ok: false,
        mongodb: "MONGODB_URI not configured",
        adminCount: 0,
        arnavadminExists: false,
      });
    }

    await connectDB();
    const adminCount = await Admin.countDocuments();
    const admins = await Admin.find({})
      .select("username email name createdAt")
      .lean();

    const arnav = await Admin.findOne({
      username: ARNAVADMIN_USERNAME,
    }).lean();

    let passwordTest = false;
    if (arnav?.password) {
      passwordTest = await bcrypt.compare(
        ARNAVADMIN_PASSWORD_PLAIN,
        arnav.password
      );
    }

    return NextResponse.json({
      ok: true,
      mongodb: "connected",
      database: process.env.MONGODB_URI?.includes("mongodb.net")
        ? "atlas"
        : "custom",
      adminCount,
      arnavadminExists: Boolean(arnav),
      arnavadminUsername: arnav?.username ?? null,
      arnavadminHasBcryptHash: arnav?.password?.startsWith("$2") ?? false,
      arnavadminPasswordTest: passwordTest,
      admins: admins.map((a) => ({
        username: a.username,
        email: a.email,
        name: a.name,
      })),
      nextauthSecretSet: Boolean(process.env.NEXTAUTH_SECRET),
    });
  } catch (error) {
    console.error("[Admin Check] error:", error);
    return NextResponse.json(
      {
        ok: false,
        mongodb: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
