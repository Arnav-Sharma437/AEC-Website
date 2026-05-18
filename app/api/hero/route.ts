import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HeroSettings } from "@/models/HeroSettings";
import { heroToSlides, normalizeHeroDoc } from "@/lib/hero-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const defaults = [
  { type: "video" as const, src: "/hero/hero-video.mp4" },
  { type: "image" as const, src: "/hero/hero-image-1.jpg" },
  { type: "image" as const, src: "/hero/hero-image-2.jpg" },
  { type: "image" as const, src: "/hero/hero-image-3.jpg" },
];

export async function GET() {
  try {
    await connectDB();
    const hero = await HeroSettings.findOne({ key: "main" }).lean();

    if (!hero) {
      return NextResponse.json(
        { slides: defaults },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    const normalized = normalizeHeroDoc(hero as Record<string, unknown>);
    const slides = heroToSlides(normalized);

    return NextResponse.json(
      { slides: slides.length > 0 ? slides : defaults },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(
      { slides: defaults },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
