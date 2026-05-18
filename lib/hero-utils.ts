export type HeroSlot = "video" | "image1" | "image2" | "image3";

export interface HeroAsset {
  url: string;
  publicId: string;
}

export interface HeroData {
  video: HeroAsset;
  image1: HeroAsset;
  image2: HeroAsset;
  image3: HeroAsset;
}

export function normalizeHeroDoc(doc: Record<string, unknown> | null): HeroData {
  const slot = (key: HeroSlot): HeroAsset => {
    const raw = doc?.[key] as { url?: string; publicId?: string } | undefined;
    return {
      url: raw?.url?.trim() || "",
      publicId: raw?.publicId?.trim() || "",
    };
  };
  return {
    video: slot("video"),
    image1: slot("image1"),
    image2: slot("image2"),
    image3: slot("image3"),
  };
}

export function heroToSlides(hero: HeroData) {
  const slides: { type: "video" | "image"; src: string }[] = [];
  if (hero.video.url) slides.push({ type: "video", src: hero.video.url });
  for (const img of [hero.image1, hero.image2, hero.image3]) {
    if (img.url) slides.push({ type: "image", src: img.url });
  }
  return slides;
}
