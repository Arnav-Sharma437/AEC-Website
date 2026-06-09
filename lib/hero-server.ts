import { connectDB } from "@/lib/mongodb";
import { HeroSettings } from "@/models/HeroSettings";
import { heroToSlides, normalizeHeroDoc, type HeroSlide } from "@/lib/hero-utils";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    await connectDB();
    const hero = await HeroSettings.findOne({ key: "main" }).lean();
    if (!hero) return [];
    return heroToSlides(normalizeHeroDoc(hero as Record<string, unknown>));
  } catch {
    return [];
  }
}
