"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GetQuoteButton from "@/components/ui/GetQuoteButton";
import AecLogo from "@/components/ui/AecLogo";

interface Slide {
  type: "video" | "image";
  src: string;
}

const defaultSlides: Slide[] = [
  { type: "video", src: "/hero/hero-video.mp4" },
  { type: "image", src: "/hero/hero-image-1.jpg" },
  { type: "image", src: "/hero/hero-image-2.jpg" },
  { type: "image", src: "/hero/hero-image-3.jpg" },
];

const IMAGE_DURATION = 4000;

export default function HeroSlider({ slides = defaultSlides }: { slides?: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + slides.length) % slides.length);
      setProgress(0);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const slide = slides[current];

    if (slide.type === "image") {
      const start = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        setProgress(Math.min((elapsed / IMAGE_DURATION) * 100, 100));
        if (elapsed >= IMAGE_DURATION) next();
      }, 50);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, slides, next]);

  const handleVideoEnded = () => next();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-primary">
      <div className="absolute left-0 right-0 top-0 z-20 h-1 bg-white/20">
        <div
          className="h-full bg-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {slides[current].type === "video" ? (
            <video
              ref={videoRef}
              src={slides[current].src}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress((v.currentTime / v.duration) * 100);
              }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${slides[current].src}), linear-gradient(135deg, #1C2B3A 0%, #2E3F52 100%)`,
              }}
            />
          )}
        </motion.section>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 pt-32 lg:px-16 lg:pb-32">
        <AecLogo size="lg" priority className="mb-4" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 max-w-3xl font-display text-4xl font-bold uppercase leading-tight text-white md:text-6xl"
        >
          Engineering Solutions You Can Trust
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 max-w-xl text-lg text-white/90"
        >
          25+ Years of Precision. Certified. Reliable.
        </motion.p>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href="/shop"
            className="rounded-md border-2 border-white px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-primary"
          >
            Explore Products
          </Link>
          <GetQuoteButton />
        </motion.section>
      </div>

      <button
        type="button"
        onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white opacity-0 backdrop-blur transition hover:bg-white/20 group-hover:opacity-100 lg:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-8 bg-accent" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
