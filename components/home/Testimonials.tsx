"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import SectionHeading from "@/components/motion/SectionHeading";
import { DURATION, EASE_OUT, fadeUp, transition, VIEWPORT_ONCE } from "@/lib/motion";

export default function Testimonials() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const visible = [
    testimonials[index % testimonials.length],
    testimonials[(index + 1) % testimonials.length],
    testimonials[(index + 2) % testimonials.length],
  ];

  return (
    <section className="bg-background py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="What Our Clients Say" />
        <ul className="grid gap-6 md:grid-cols-3">
          {visible.map((t, i) => (
            <motion.li
              key={`${t.id}-${index}`}
              initial={reduced ? false : fadeUp.hidden}
              whileInView={reduced ? undefined : fadeUp.visible}
              viewport={VIEWPORT_ONCE}
              transition={{
                ...transition(reduced, DURATION.medium),
                delay: reduced ? 0 : i * 0.1,
                ease: EASE_OUT,
              }}
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
            >
              <p className="mb-4 italic text-muted">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-semibold text-primary dark:text-foreground">{t.name}</p>
              <p className="text-sm text-muted">{t.company}</p>
              <p className="mt-2 flex gap-0.5 text-accent">
                {Array.from({ length: t.rating }).map((_, star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </p>
            </motion.li>
          ))}
        </ul>
        <nav className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setIndex((i) => i - 1)}
            className="rounded-full border border-border p-2 hover:bg-surface dark:hover:bg-card"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="rounded-full border border-border p-2 hover:bg-surface dark:hover:bg-card"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </article>
    </section>
  );
}
