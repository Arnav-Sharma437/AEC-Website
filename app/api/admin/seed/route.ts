import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { seedDefaultAdmins } from "@/lib/seed-admins";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-seed-secret");
    const envSecret = process.env.SEED_SECRET;

    await connectDB();
    const adminCount = await Admin.countDocuments();

    const authorized =
      (envSecret && secret === envSecret) || adminCount === 0;

    if (!authorized) {
      return NextResponse.json(
        { error: "Unauthorized. Set SEED_SECRET header or no admins exist yet." },
        { status: 401 }
      );
    }

    const results = await seedDefaultAdmins();

    return NextResponse.json({
      success: true,
      message: "Admin users seeded successfully",
      admins: results.map((r) => r.username),
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed admins. Check MONGODB_URI." },
      { status: 500 }
    );
  }
}
