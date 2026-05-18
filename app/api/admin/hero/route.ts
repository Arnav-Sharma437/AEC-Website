import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HeroSettings } from "@/models/HeroSettings";
import { requireAdminSession } from "@/lib/admin-api";
import { deleteFromCloudinary } from "@/lib/cloudinary";

async function getOrCreateHero() {
  await connectDB();
  let hero = await HeroSettings.findOne({ key: "main" });
  if (!hero) {
    hero = await HeroSettings.create({ key: "main" });
  }
  return hero;
}

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const hero = await getOrCreateHero();
    return NextResponse.json(hero);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load hero" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { slot, url, publicId, action } = body as {
      slot: "video" | "image1" | "image2" | "image3";
      url?: string;
      publicId?: string;
      action?: "delete";
    };

    const hero = await getOrCreateHero();
    const current = hero[slot] as { url?: string; publicId?: string };

    if (action === "delete") {
      if (current?.publicId) {
        await deleteFromCloudinary(
          current.publicId,
          slot === "video" ? "video" : "image"
        );
      }
      hero[slot] = { url: "", publicId: "" };
    } else {
      if (current?.publicId && publicId !== current.publicId) {
        await deleteFromCloudinary(
          current.publicId,
          slot === "video" ? "video" : "image"
        );
      }
      hero[slot] = { url: url || "", publicId: publicId || "" };
    }

    await hero.save();
    return NextResponse.json(hero);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}
