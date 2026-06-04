"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/motion/SectionHeading";
import { DURATION, EASE_OUT, fadeUp, transition, VIEWPORT_ONCE } from "@/lib/motion";

const factoryImages = [
  {
    src: "/images/factory/Factory-1.jpeg",
    alt: "AEC manufacturing floor — lifting equipment production",
  },
  {
    src: "/images/factory/Factory-2.jpeg",
    alt: "AEC factory — rigging and material handling assembly",
  },
  {
    src: "/images/factory/Factory-3.jpeg",
    alt: "AEC production and quality control area",
  },
  {
    src: "/images/factory/Factory-4.jpeg",
    alt: "AEC production facility — Howrah, West Bengal",
  },
];

export default function FactoryProduction() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#0a0f14] py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(212,168,67,0.06) 48px, rgba(212,168,67,0.06) 49px)",
        }}
        aria-hidden
      />

      <article className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Our Factory & Production"
          subtitle="State-of-the-art manufacturing facility in Howrah, West Bengal"
          light
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {factoryImages.map((img, index) => (
            <motion.li
              key={img.src}
              initial={reduced ? false : fadeUp.hidden}
              whileInView={reduced ? undefined : fadeUp.visible}
              viewport={VIEWPORT_ONCE}
              transition={{
                ...transition(reduced, DURATION.medium),
                delay: reduced ? 0 : index * 0.12,
                ease: EASE_OUT,
              }}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-condensed text-xs font-semibold uppercase tracking-widest text-accent">
                  AEC Factory
                </p>
                <p className="mt-1 text-sm text-white/90">Howrah, West Bengal</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </article>
    </section>
  );
}
