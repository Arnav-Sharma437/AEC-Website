"use client";

import { useState, useEffect, useCallback, useRef, type RefObject } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { HeroSlide } from "@/lib/hero-utils";
import { DURATION, EASE_OUT } from "@/lib/motion";

const IMAGE_DURATION = 4000;
const EMPTY_BG = "bg-[#0a0f14]";

const textContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const textItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch("/api/hero", { cache: "no-store" });
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

function preloadImage(src: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

function preloadSlides(slides: HeroSlide[]) {
  slides.forEach((slide) => {
    if (slide.type === "image") {
      preloadImage(slide.src);
      if (slide.mobileSrc) preloadImage(slide.mobileSrc);
    } else if (slide.mobileSrc) {
      preloadImage(slide.mobileSrc);
    }
  });
}

function HeroCta({ text, link }: { text: string; link: string }) {
  const href = link || "/shop";
  const isExternal = /^https?:\/\//i.test(href);

  const className =
    "inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-primary transition-colors duration-300 ease-out hover:brightness-105";

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

function HeroSlideMedia({
  slide,
  priority,
  videoRef,
  onVideoEnded,
  onVideoTimeUpdate,
}: {
  slide: HeroSlide;
  priority: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  onVideoEnded: () => void;
  onVideoTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}) {
  const imgProps = {
    alt: "",
    className: "h-full w-full object-cover",
    decoding: "async" as const,
    ...(priority ? { fetchPriority: "high" as const } : {}),
  };

  if (slide.type === "video") {
    return (
      <>
        {slide.mobileSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...imgProps}
            src={slide.mobileSrc}
            className={`${imgProps.className} md:hidden`}
          />
        )}
        <video
          ref={videoRef}
          key={slide.src}
          src={slide.src}
          autoPlay
          muted
          playsInline
          preload={priority ? "auto" : "metadata"}
          onEnded={onVideoEnded}
          onTimeUpdate={onVideoTimeUpdate}
          className={`h-full w-full object-cover ${slide.mobileSrc ? "hidden md:block" : ""}`}
        />
      </>
    );
  }

  if (slide.mobileSrc) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...imgProps} src={slide.mobileSrc} className={`${imgProps.className} md:hidden`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...imgProps}
          src={slide.src}
          className={`${imgProps.className} hidden md:block`}
        />
      </>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...imgProps} src={slide.src} />
  );
}

interface HeroSliderProps {
  initialSlides: HeroSlide[];
}

export default function HeroSlider({ initialSlides }: HeroSliderProps) {
  const reduced = useReducedMotion();
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshSlides = useCallback(() => {
    fetchHeroSlides().then((next) => {
      if (next.length > 0) {
        setSlides(next);
        setCurrent(0);
        setProgress(0);
        preloadSlides(next);
      }
    });
  }, []);

  useEffect(() => {
    preloadSlides(initialSlides);
  }, [initialSlides]);

  useEffect(() => {
    const onFocus = () => refreshSlides();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshSlides]);

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
          key={`${current}-${slide.src}-${slide.mobileSrc ?? ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="absolute inset-0"
        >
          <HeroSlideMedia
            slide={slide}
            priority={current === 0}
            videoRef={videoRef}
            onVideoEnded={next}
            onVideoTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress((v.currentTime / v.duration) * 100);
            }}
          />
        </motion.div>
      </AnimatePresence>

      {hasCopy && (
        <motion.div
          key={`overlay-${current}`}
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
        />
      )}

      {hasCopy && (
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 pt-32 lg:px-16 lg:pb-32">
          <motion.div
            key={`copy-${current}`}
            variants={reduced ? undefined : textContainer}
            initial={reduced ? false : "hidden"}
            animate="show"
          >
            {slide.heading && (
              <motion.h1
                variants={reduced ? undefined : textItem}
                className="mb-3 max-w-3xl font-display text-3xl font-bold uppercase leading-tight text-white md:text-5xl lg:text-6xl"
              >
                {slide.heading}
              </motion.h1>
            )}
            {slide.subheading && (
              <motion.p
                variants={reduced ? undefined : textItem}
                className="mb-8 max-w-xl text-base text-white/90 md:text-lg"
              >
                {slide.subheading}
              </motion.p>
            )}
            {slide.buttonText && (
              <motion.div
                variants={reduced ? undefined : textItem}
                transition={
                  reduced
                    ? undefined
                    : { delay: 0.28, duration: DURATION.medium, ease: EASE_OUT }
                }
                className="pointer-events-auto"
              >
                <HeroCta text={slide.buttonText} link={slide.buttonLink} />
              </motion.div>
            )}
          </motion.div>
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
