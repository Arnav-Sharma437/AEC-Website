import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HeroSettings } from "@/models/HeroSettings";
import { requireAdminSession } from "@/lib/admin-api";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import {
  normalizeHeroDoc,
  EMPTY_HERO_ASSET,
  type HeroSlot,
  type HeroAsset,
} from "@/lib/hero-utils";

async function getOrCreateHero() {
  await connectDB();
  let hero = await HeroSettings.findOne({ key: "main" });
  if (!hero) {
    hero = await HeroSettings.create({ key: "main" });
  }
  return hero;
}

function copyFields(body: Record<string, unknown>) {
  return {
    heading: typeof body.heading === "string" ? body.heading.trim() : undefined,
    subheading:
      typeof body.subheading === "string" ? body.subheading.trim() : undefined,
    buttonText:
      typeof body.buttonText === "string" ? body.buttonText.trim() : undefined,
    buttonLink:
      typeof body.buttonLink === "string" ? body.buttonLink.trim() : undefined,
  };
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
    const current = normalizeHeroDoc(hero.toObject() as Record<string, unknown>)[
      slot
    ];
    const copy = copyFields(body);

    if (action === "delete") {
      if (current.publicId) {
        await deleteFromCloudinary(
          current.publicId,
          slot === "video" ? "video" : "image"
        );
      }
      hero.set(slot, { ...EMPTY_HERO_ASSET });
    } else if (url?.trim() && publicId?.trim()) {
      if (current.publicId && publicId !== current.publicId) {
        await deleteFromCloudinary(
          current.publicId,
          slot === "video" ? "video" : "image"
        );
      }
      const next: HeroAsset = {
        url: url.trim(),
        publicId: publicId.trim(),
        heading: copy.heading ?? current.heading,
        subheading: copy.subheading ?? current.subheading,
        buttonText: copy.buttonText ?? current.buttonText,
        buttonLink: copy.buttonLink ?? current.buttonLink,
      };
      hero.set(slot, next);
    } else {
      const next: HeroAsset = {
        ...current,
        heading: copy.heading ?? current.heading,
        subheading: copy.subheading ?? current.subheading,
        buttonText: copy.buttonText ?? current.buttonText,
        buttonLink: copy.buttonLink ?? current.buttonLink,
      };
      if (!next.url) {
        return NextResponse.json(
          { error: "Upload media before saving slide text" },
          { status: 400 }
        );
      }
      hero.set(slot, next);
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
