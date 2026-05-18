import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { seedDefaultAdmins } from "@/lib/seed-admins";
import { ARNAVADMIN_PASSWORD_PLAIN } from "@/lib/admin-credentials";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    message: "POST to this URL to seed admins. Use ?force=true to reset passwords.",
    hint: "curl -X POST https://your-site.com/api/admin/seed?force=true",
  });
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-seed-secret");
    const envSecret = process.env.SEED_SECRET;
    const force = request.nextUrl.searchParams.get("force") === "true";

    if (!process.env.MONGODB_URI?.trim()) {
      console.error("[Admin Seed] MONGODB_URI is empty or missing");
      return NextResponse.json(
        { ok: false, error: "MONGODB_URI is not configured on this deployment" },
        { status: 500 }
      );
    }

    console.log("[Admin Seed] Connecting to MongoDB...");
    await connectDB();
    console.log("[Admin Seed] Connected");

    const adminCountBefore = await Admin.countDocuments();
    console.log("[Admin Seed] Admins before:", adminCountBefore);

    const authorized =
      adminCountBefore === 0 ||
      (envSecret && secret === envSecret) ||
      force;

    if (!authorized) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Unauthorized. No admins yet, or pass ?force=true after setting SEED_SECRET, or POST with x-seed-secret header.",
          adminCountBefore,
        },
        { status: 401 }
      );
    }

    const results = await seedDefaultAdmins();

    const arnav = await Admin.findOne({ username: "arnavadmin" }).lean();
    const loginTest = arnav?.password
      ? await bcrypt.compare(ARNAVADMIN_PASSWORD_PLAIN, arnav.password)
      : false;

    const adminCountAfter = await Admin.countDocuments();

    console.log("[Admin Seed] Complete", {
      results,
      adminCountAfter,
      loginTest,
    });

    return NextResponse.json({
      ok: true,
      message: "Admin users seeded successfully",
      mongodb: "connected",
      adminCountBefore,
      adminCountAfter,
      admins: results,
      arnavadminLoginTest: loginTest,
    });
  } catch (error) {
    console.error("[Admin Seed] error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to seed admins",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
