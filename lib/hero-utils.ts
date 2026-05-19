export type HeroSlot = "video" | "image1" | "image2" | "image3";

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
  image1: HeroAsset;
  image2: HeroAsset;
  image3: HeroAsset;
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

export function normalizeHeroDoc(doc: Record<string, unknown> | null): HeroData {
  const slot = (key: HeroSlot): HeroAsset =>
    parseAsset(doc?.[key] as Record<string, unknown> | undefined);

  return {
    video: slot("video"),
    image1: slot("image1"),
    image2: slot("image2"),
    image3: slot("image3"),
  };
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
  for (const img of [hero.image1, hero.image2, hero.image3]) {
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
