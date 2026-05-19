"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroSlide } from "@/lib/hero-utils";

const IMAGE_DURATION = 4000;
const EMPTY_BG = "bg-[#0a0f14]";

async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`/api/hero?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.slides)) return [];
    return data.slides.filter(
      (s: HeroSlide) =>
        s &&
        typeof s.src === "string" &&
        s.src.trim().length > 0 &&
        (s.type === "video" || s.type === "image")
    );
  } catch {
    return [];
  }
}

function HeroCta({ text, link }: { text: string; link: string }) {
  const href = link || "/shop";
  const isExternal = /^https?:\/\//i.test(href);

  const className =
    "inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-primary transition hover:brightness-105";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {text}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  );
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadSlides = useCallback(() => {
    fetchHeroSlides().then((next) => {
      setSlides(next);
      setCurrent(0);
      setProgress(0);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    loadSlides();
    const onFocus = () => loadSlides();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadSlides]);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setCurrent((index + slides.length) % slides.length);
      setProgress(0);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const slide = slides[current];
    if (!slide || slide.type !== "image") return;

    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / IMAGE_DURATION) * 100, 100));
      if (elapsed >= IMAGE_DURATION) next();
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, slides, next]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || slides[current]?.type !== "video") return;
    v.load();
    v.play().catch(() => {});
  }, [current, slides]);

  if (!ready) {
    return <section className={`relative h-screen w-full ${EMPTY_BG}`} aria-hidden />;
  }

  if (slides.length === 0) {
    return (
      <section
        className={`relative h-screen w-full ${EMPTY_BG}`}
        aria-label="Hero banner"
      />
    );
  }

  const slide = slides[current];
  const hasCopy = Boolean(slide.heading || slide.subheading || slide.buttonText);

  return (
    <section className={`relative h-screen w-full overflow-hidden ${EMPTY_BG}`}>
      <div className="absolute left-0 right-0 top-0 z-20 h-1 bg-white/20">
        <div
          className="h-full bg-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${current}-${slide.src}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {slide.type === "video" ? (
            <video
              ref={videoRef}
              key={slide.src}
              src={slide.src}
              autoPlay
              muted
              playsInline
              onEnded={next}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress((v.currentTime / v.duration) * 100);
              }}
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.src} alt="" className="h-full w-full object-cover" />
          )}
        </motion.div>
      </AnimatePresence>

      {hasCopy && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
      )}

      {hasCopy && (
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 pt-32 lg:px-16 lg:pb-32">
          {slide.heading && (
            <motion.h1
              key={`h-${current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 max-w-3xl font-display text-3xl font-bold uppercase leading-tight text-white md:text-5xl lg:text-6xl"
            >
              {slide.heading}
            </motion.h1>
          )}
          {slide.subheading && (
            <motion.p
              key={`s-${current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mb-8 max-w-xl text-base text-white/90 md:text-lg"
            >
              {slide.subheading}
            </motion.p>
          )}
          {slide.buttonText && (
            <motion.div
              key={`b-${current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="pointer-events-auto"
            >
              <HeroCta text={slide.buttonText} link={slide.buttonLink} />
            </motion.div>
          )}
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
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
        </>
      )}
    </section>
  );
}
