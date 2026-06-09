import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HeroSettings } from "@/models/HeroSettings";
import { requireAdminSession } from "@/lib/admin-api";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import {
  normalizeHeroDoc,
  parseHeroSlot,
  EMPTY_HERO_ASSET,
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

function persistImages(hero: InstanceType<typeof HeroSettings>, images: HeroAsset[]) {
  hero.set("images", images);
  hero.markModified("images");
  hero.set("image1", undefined);
  hero.set("image2", undefined);
  hero.set("image3", undefined);
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
      slot?: string;
      url?: string;
      publicId?: string;
      action?: "delete" | "add";
    };

    if (action === "add") {
      await connectDB();
      const hero = await getOrCreateHero();
      const normalized = normalizeHeroDoc(hero.toObject() as Record<string, unknown>);
      const images = [...normalized.images, { ...EMPTY_HERO_ASSET }];
      persistImages(hero, images);
      await hero.save();
      return NextResponse.json(
        normalizeHeroDoc(hero.toObject() as Record<string, unknown>)
      );
    }

    if (!slot) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    const parsed = parseHeroSlot(slot);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    await connectDB();
    const hero = await getOrCreateHero();
    const normalized = normalizeHeroDoc(hero.toObject() as Record<string, unknown>);
    const copy = copyFields(body);

    if (parsed.type === "video") {
      const current = normalized.video;

      if (action === "delete") {
        if (current.publicId) {
          await deleteFromCloudinary(current.publicId, "video");
        }
        hero.set("video", { ...EMPTY_HERO_ASSET });
        hero.markModified("video");
      } else if (url?.trim() && publicId?.trim()) {
        if (current.publicId && publicId !== current.publicId) {
          await deleteFromCloudinary(current.publicId, "video");
        }
        const next: HeroAsset = {
          url: url.trim(),
          publicId: publicId.trim(),
          heading: copy.heading ?? current.heading,
          subheading: copy.subheading ?? current.subheading,
          buttonText: copy.buttonText ?? current.buttonText,
          buttonLink: copy.buttonLink ?? current.buttonLink,
        };
        hero.set("video", next);
        hero.markModified("video");
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
        hero.set("video", next);
        hero.markModified("video");
      }
    } else {
      const index = parsed.index;
      const images = [...normalized.images];

      while (images.length <= index) {
        images.push({ ...EMPTY_HERO_ASSET });
      }

      const current = images[index];

      if (action === "delete") {
        if (current.publicId) {
          await deleteFromCloudinary(current.publicId, "image");
        }
        images.splice(index, 1);
        persistImages(hero, images);
      } else if (url?.trim() && publicId?.trim()) {
        if (current.publicId && publicId !== current.publicId) {
          await deleteFromCloudinary(current.publicId, "image");
        }
        images[index] = {
          url: url.trim(),
          publicId: publicId.trim(),
          heading: copy.heading ?? current.heading,
          subheading: copy.subheading ?? current.subheading,
          buttonText: copy.buttonText ?? current.buttonText,
          buttonLink: copy.buttonLink ?? current.buttonLink,
        };
        persistImages(hero, images);
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
        images[index] = next;
        persistImages(hero, images);
      }
    }

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
