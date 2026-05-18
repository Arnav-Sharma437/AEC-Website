import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HeroSettings } from "@/models/HeroSettings";
import { requireAdminSession } from "@/lib/admin-api";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { normalizeHeroDoc, type HeroSlot } from "@/lib/hero-utils";

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
    const plain = hero.toObject();
    return NextResponse.json(normalizeHeroDoc(plain as Record<string, unknown>));
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
      slot: HeroSlot;
      url?: string;
      publicId?: string;
      action?: "delete";
    };

    if (!slot || !["video", "image1", "image2", "image3"].includes(slot)) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    await connectDB();
    const hero = await getOrCreateHero();
    const current = normalizeHeroDoc(hero.toObject() as Record<string, unknown>)[slot];

    if (action === "delete") {
      if (current.publicId) {
        await deleteFromCloudinary(
          current.publicId,
          slot === "video" ? "video" : "image"
        );
      }
      hero.set(slot, { url: "", publicId: "" });
    } else {
      if (!url?.trim()) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }
      if (current.publicId && publicId && publicId !== current.publicId) {
        await deleteFromCloudinary(
          current.publicId,
          slot === "video" ? "video" : "image"
        );
      }
      hero.set(slot, { url: url.trim(), publicId: publicId?.trim() || "" });
    }

    hero.markModified(slot);
    await hero.save();

    const updated = normalizeHeroDoc(hero.toObject() as Record<string, unknown>);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update hero" },
      { status: 500 }
    );
  }
}
