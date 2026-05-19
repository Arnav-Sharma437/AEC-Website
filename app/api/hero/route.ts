import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HeroSettings } from "@/models/HeroSettings";
import { heroToSlides, normalizeHeroDoc } from "@/lib/hero-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = { headers: { "Cache-Control": "no-store, max-age=0" } };

export async function GET() {
  try {
    await connectDB();
    const hero = await HeroSettings.findOne({ key: "main" }).lean();

    if (!hero) {
      return NextResponse.json({ slides: [] }, NO_CACHE);
    }

    const normalized = normalizeHeroDoc(hero as Record<string, unknown>);
    const slides = heroToSlides(normalized);

    return NextResponse.json({ slides }, NO_CACHE);
  } catch {
    return NextResponse.json({ slides: [] }, NO_CACHE);
  }
}
