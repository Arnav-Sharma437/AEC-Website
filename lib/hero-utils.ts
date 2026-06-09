export type HeroSlot = "video" | `image-${number}`;

export type HeroVariant = "desktop" | "mobile";

export interface HeroAsset {
  url: string;
  publicId: string;
  mobileUrl: string;
  mobilePublicId: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
}

export interface HeroData {
  video: HeroAsset;
  images: HeroAsset[];
}

export interface HeroSlide {
  type: "video" | "image";
  src: string;
  mobileSrc?: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
}

const DESKTOP_WIDTH = 1920;
const MOBILE_WIDTH = 828;

function parseAsset(raw: Record<string, unknown> | undefined): HeroAsset {
  return {
    url: String(raw?.url ?? "").trim(),
    publicId: String(raw?.publicId ?? "").trim(),
    mobileUrl: String(raw?.mobileUrl ?? "").trim(),
    mobilePublicId: String(raw?.mobilePublicId ?? "").trim(),
    heading: String(raw?.heading ?? "").trim(),
    subheading: String(raw?.subheading ?? "").trim(),
    buttonText: String(raw?.buttonText ?? "").trim(),
    buttonLink: String(raw?.buttonLink ?? "").trim(),
  };
}

const LEGACY_IMAGE_KEYS = ["image1", "image2", "image3"] as const;

function imagesFromLegacy(doc: Record<string, unknown>): HeroAsset[] {
  const legacy = LEGACY_IMAGE_KEYS.map((key) =>
    parseAsset(doc[key] as Record<string, unknown> | undefined)
  );
  if (!legacy.some((asset) => asset.url)) return [];
  return legacy;
}

export function imageSlot(index: number): HeroSlot {
  return `image-${index}`;
}

export function mobilePendingKey(slot: string): string {
  return `${slot}:mobile`;
}

export function parseHeroSlot(
  slot: string
): { type: "video" } | { type: "image"; index: number } | null {
  if (slot === "video") return { type: "video" };
  const match = /^image-(\d+)$/.exec(slot);
  if (match) return { type: "image", index: Number(match[1]) };
  const legacy: Record<string, number> = { image1: 0, image2: 1, image3: 2 };
  if (slot in legacy) return { type: "image", index: legacy[slot] };
  return null;
}

export function normalizeHeroDoc(doc: Record<string, unknown> | null): HeroData {
  const video = parseAsset(doc?.video as Record<string, unknown> | undefined);

  let images: HeroAsset[] = [];
  if (Array.isArray(doc?.images)) {
    images = doc.images.map((img) =>
      parseAsset(img as Record<string, unknown> | undefined)
    );
  } else if (doc) {
    images = imagesFromLegacy(doc);
  }

  return { video, images };
}

/** Lighter Cloudinary delivery URLs for faster hero loads. */
export function optimizeHeroDeliveryUrl(
  url: string,
  target: "desktop" | "mobile"
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const width = target === "mobile" ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const transforms = `f_auto,q_auto:good,w_${width},c_limit`;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const after = url.slice(idx + marker.length);
  if (after.startsWith("f_auto,") || after.startsWith("q_auto,")) return url;
  return `${url.slice(0, idx + marker.length)}${transforms}/${after}`;
}

export function assetToSlide(
  type: "video" | "image",
  asset: HeroAsset
): HeroSlide | null {
  if (!asset.url) return null;
  const slide: HeroSlide = {
    type,
    src:
      type === "image"
        ? optimizeHeroDeliveryUrl(asset.url, "desktop")
        : asset.url,
    heading: asset.heading,
    subheading: asset.subheading,
    buttonText: asset.buttonText,
    buttonLink: asset.buttonLink,
  };
  if (asset.mobileUrl) {
    slide.mobileSrc = optimizeHeroDeliveryUrl(asset.mobileUrl, "mobile");
  }
  return slide;
}

export function heroToSlides(hero: HeroData): HeroSlide[] {
  const slides: HeroSlide[] = [];
  const video = assetToSlide("video", hero.video);
  if (video) slides.push(video);
  for (const img of hero.images) {
    const slide = assetToSlide("image", img);
    if (slide) slides.push(slide);
  }
  return slides;
}

export const EMPTY_HERO_ASSET: HeroAsset = {
  url: "",
  publicId: "",
  mobileUrl: "",
  mobilePublicId: "",
  heading: "",
  subheading: "",
  buttonText: "",
  buttonLink: "",
};
