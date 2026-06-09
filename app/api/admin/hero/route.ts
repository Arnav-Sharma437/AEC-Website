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
  type HeroVariant,
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

async function clearMobileAsset(asset: HeroAsset): Promise<HeroAsset> {
  if (asset.mobilePublicId) {
    await deleteFromCloudinary(asset.mobilePublicId, "image");
  }
  return { ...asset, mobileUrl: "", mobilePublicId: "" };
}

async function clearDesktopAsset(
  asset: HeroAsset,
  resourceType: "image" | "video"
): Promise<HeroAsset> {
  if (asset.publicId) {
    await deleteFromCloudinary(asset.publicId, resourceType);
  }
  if (asset.mobilePublicId) {
    await deleteFromCloudinary(asset.mobilePublicId, "image");
  }
  return { ...EMPTY_HERO_ASSET };
}

function updateDesktopAsset(
  current: HeroAsset,
  copy: ReturnType<typeof copyFields>,
  url?: string,
  publicId?: string
): HeroAsset {
  if (url?.trim() && publicId?.trim()) {
    return {
      ...current,
      url: url.trim(),
      publicId: publicId.trim(),
      heading: copy.heading ?? current.heading,
      subheading: copy.subheading ?? current.subheading,
      buttonText: copy.buttonText ?? current.buttonText,
      buttonLink: copy.buttonLink ?? current.buttonLink,
    };
  }
  return {
    ...current,
    heading: copy.heading ?? current.heading,
    subheading: copy.subheading ?? current.subheading,
    buttonText: copy.buttonText ?? current.buttonText,
    buttonLink: copy.buttonLink ?? current.buttonLink,
  };
}

function updateMobileAsset(
  current: HeroAsset,
  url: string,
  publicId: string
): HeroAsset {
  return {
    ...current,
    mobileUrl: url.trim(),
    mobilePublicId: publicId.trim(),
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
    const { slot, url, publicId, action, variant } = body as {
      slot?: string;
      url?: string;
      publicId?: string;
      action?: "delete" | "add" | "delete-mobile";
      variant?: HeroVariant;
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
    const isMobileVariant = variant === "mobile";

    if (parsed.type === "video") {
      let next = normalized.video;

      if (action === "delete-mobile") {
        next = await clearMobileAsset(next);
        hero.set("video", next);
        hero.markModified("video");
      } else if (action === "delete") {
        next = await clearDesktopAsset(next, "video");
        hero.set("video", next);
        hero.markModified("video");
      } else if (isMobileVariant && url?.trim() && publicId?.trim()) {
        if (next.mobilePublicId && publicId !== next.mobilePublicId) {
          await deleteFromCloudinary(next.mobilePublicId, "image");
        }
        next = updateMobileAsset(next, url, publicId);
        hero.set("video", next);
        hero.markModified("video");
      } else if (!isMobileVariant) {
        if (url?.trim() && publicId?.trim() && next.publicId && publicId !== next.publicId) {
          await deleteFromCloudinary(next.publicId, "video");
        }
        next = updateDesktopAsset(next, copy, url, publicId);
        if (!next.url) {
          return NextResponse.json(
            { error: "Upload media before saving slide text" },
            { status: 400 }
          );
        }
        hero.set("video", next);
        hero.markModified("video");
      } else {
        return NextResponse.json({ error: "Upload mobile banner first" }, { status: 400 });
      }
    } else {
      const index = parsed.index;
      const images = [...normalized.images];

      while (images.length <= index) {
        images.push({ ...EMPTY_HERO_ASSET });
      }

      let current = images[index];

      if (action === "delete-mobile") {
        current = await clearMobileAsset(current);
        images[index] = current;
        persistImages(hero, images);
      } else if (action === "delete") {
        current = await clearDesktopAsset(current, "image");
        images.splice(index, 1);
        persistImages(hero, images);
      } else if (isMobileVariant && url?.trim() && publicId?.trim()) {
        if (!current.url) {
          return NextResponse.json(
            { error: "Upload desktop banner before adding mobile" },
            { status: 400 }
          );
        }
        if (current.mobilePublicId && publicId !== current.mobilePublicId) {
          await deleteFromCloudinary(current.mobilePublicId, "image");
        }
        images[index] = updateMobileAsset(current, url, publicId);
        persistImages(hero, images);
      } else if (!isMobileVariant) {
        if (url?.trim() && publicId?.trim() && current.publicId && publicId !== current.publicId) {
          await deleteFromCloudinary(current.publicId, "image");
        }
        current = updateDesktopAsset(current, copy, url, publicId);
        if (!current.url) {
          return NextResponse.json(
            { error: "Upload media before saving slide text" },
            { status: 400 }
          );
        }
        images[index] = current;
        persistImages(hero, images);
      } else {
        return NextResponse.json({ error: "Upload mobile banner first" }, { status: 400 });
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
