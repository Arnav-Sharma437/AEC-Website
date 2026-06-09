export type HeroSlot = "video" | `image-${number}`;

export interface HeroAsset {
  url: string;
  publicId: string;
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
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
}

function parseAsset(raw: Record<string, unknown> | undefined): HeroAsset {
  return {
    url: String(raw?.url ?? "").trim(),
    publicId: String(raw?.publicId ?? "").trim(),
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

export function assetToSlide(
  type: "video" | "image",
  asset: HeroAsset
): HeroSlide | null {
  if (!asset.url) return null;
  return {
    type,
    src: asset.url,
    heading: asset.heading,
    subheading: asset.subheading,
    buttonText: asset.buttonText,
    buttonLink: asset.buttonLink,
  };
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
  heading: "",
  subheading: "",
  buttonText: "",
  buttonLink: "",
};
