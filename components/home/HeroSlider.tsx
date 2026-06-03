"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import type { HeroSlide } from "@/lib/hero-utils";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";
import Magnetic from "@/components/premium/Magnetic";
import MouseTilt from "@/components/premium/MouseTilt";

const HeroParticles = dynamic(
  () => import("@/components/premium/HeroParticles"),
  { ssr: false }
);

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
    "inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-primary transition-colors duration-300 ease-out hover:brightness-105";

  const inner = isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {text}
    </a>
  ) : (
    <Link href={href} className={className}>
      {text}
    </Link>
  );

  return <Magnetic className="inline-block">{inner}</Magnetic>;
}

export default function HeroSlider() {
  const premium = usePremiumMotion();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
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

  useGSAP(
    () => {
      if (!premium || !sectionRef.current || !bgRef.current || !fgRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(bgRef.current, { y: p * 120 });
          gsap.set(fgRef.current, { y: p * -40 });
        },
      });

      if (copyRef.current) {
        gsap.fromTo(
          copyRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.15,
          }
        );
      }
    },
    { dependencies: [premium, current], scope: sectionRef }
  );

  useEffect(() => {
    if (!premium || !copyRef.current) return;
    gsap.fromTo(
      copyRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
  }, [current, premium]);

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
    <section
      ref={sectionRef}
      className={`hero-section relative h-screen w-full overflow-hidden ${EMPTY_BG}`}
    >
      <div className="absolute left-0 right-0 top-0 z-30 h-1 bg-white/20">
        <div
          className="h-full bg-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div ref={bgRef} className="hero-bg-layer absolute inset-0 z-0">
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
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            className="h-full w-full object-cover transition-opacity duration-700"
          />
        )}
      </div>

      {premium && <HeroParticles />}

      {hasCopy && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
      )}

      <div
        ref={fgRef}
        className="hero-fg-layer relative z-20 flex h-full flex-col justify-end px-6 pb-24 pt-32 lg:px-16 lg:pb-32"
      >
        {hasCopy && (
          <div ref={copyRef}>
            <MouseTilt
              className={premium ? "hero-text-tilt max-w-3xl" : "max-w-3xl"}
              maxTilt={premium ? 10 : 0}
            >
              {slide.heading && (
                <h1 className="mb-3 font-display text-3xl font-bold uppercase leading-tight text-white md:text-5xl lg:text-6xl">
                  {slide.heading}
                </h1>
              )}
              {slide.subheading && (
                <p className="mb-8 max-w-xl text-base text-white/90 md:text-lg">
                  {slide.subheading}
                </p>
              )}
            </MouseTilt>
            {slide.buttonText && (
              <div className="pointer-events-auto mt-2">
                <HeroCta text={slide.buttonText} link={slide.buttonLink} />
              </div>
            )}
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="Previous slide"
            data-cursor-hover
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="Next slide"
            data-cursor-hover
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-8 bg-accent" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                data-cursor-hover
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
