"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/motion/SectionHeading";
import { toTitleCase } from "@/lib/title-case";
import { DURATION, EASE_OUT, fadeUp, transition, VIEWPORT_ONCE } from "@/lib/motion";

const factoryImages = [
  { src: "/images/factory/Factory-1.jpeg", alt: "AEC factory and warehouse — view 1" },
  { src: "/images/factory/Factory-2.jpeg", alt: "AEC factory and warehouse — view 2" },
  { src: "/images/factory/Factory-3.jpeg", alt: "AEC factory and warehouse — view 3" },
  { src: "/images/factory/Factory-4.jpeg", alt: "AEC factory and warehouse — view 4" },
];

export default function FactoryProduction() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-background py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Our Factory & Warehouse"
          subtitle={toTitleCase(
            "state-of-the-art manufacturing and warehouse facility in howrah, west bengal"
          )}
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {factoryImages.map((img, index) => (
            <motion.li
              key={img.src}
              initial={reduced ? false : fadeUp.hidden}
              whileInView={reduced ? undefined : fadeUp.visible}
              viewport={VIEWPORT_ONCE}
              transition={{
                ...transition(reduced, DURATION.medium),
                delay: reduced ? 0 : index * 0.08,
                ease: EASE_OUT,
              }}
              className="overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="h-auto min-h-[280px] w-full object-contain sm:min-h-[360px] lg:min-h-[420px]"
                loading="lazy"
                decoding="async"
              />
            </motion.li>
          ))}
        </ul>
      </article>
    </section>
  );
}
