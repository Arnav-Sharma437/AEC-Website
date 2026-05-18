import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HeroSettings } from "@/models/HeroSettings";

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
      return NextResponse.json({ slides: defaults });
    }

    const slides = [];
    if (hero.video?.url) {
      slides.push({ type: "video", src: hero.video.url });
    }
    for (const img of [hero.image1, hero.image2, hero.image3]) {
      if (img?.url) slides.push({ type: "image", src: img.url });
    }

    if (slides.length === 0) {
      return NextResponse.json({ slides: defaults });
    }

    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ slides: defaults });
  }
}
