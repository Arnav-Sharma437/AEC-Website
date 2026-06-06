"use client";

import { motion, useReducedMotion } from "framer-motion";
import FounderPortrait from "./FounderPortrait";
import { FOUNDER } from "@/data/founder";
import {
  DURATION,
  slideFromLeft,
  slideFromRight,
  transition,
  VIEWPORT_ONCE,
} from "@/lib/motion";

export default function FounderMessage() {
  const reduced = useReducedMotion();

  return (
    <section className="py-20">
      <article className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <motion.div
          className="flex justify-center lg:justify-start"
          initial={reduced ? false : slideFromLeft.hidden}
          whileInView={reduced ? undefined : slideFromLeft.visible}
          viewport={VIEWPORT_ONCE}
          transition={transition(reduced, DURATION.medium)}
        >
          <FounderPortrait />
        </motion.div>
        <motion.section
          initial={reduced ? false : slideFromRight.hidden}
          whileInView={reduced ? undefined : slideFromRight.visible}
          viewport={VIEWPORT_ONCE}
          transition={transition(reduced, DURATION.medium)}
        >
          <p className="mb-2 font-condensed text-sm font-semibold uppercase tracking-widest text-accent">
            Founder&apos;s Message
          </p>
          <h2 className="mb-2 font-display text-2xl font-bold text-primary dark:text-foreground">
            {FOUNDER.name}
          </h2>
          <p className="mb-6 text-muted">{FOUNDER.designation}</p>
          <blockquote className="space-y-4 leading-relaxed text-muted">
            {FOUNDER.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </blockquote>
        </motion.section>
      </article>
    </section>
  );
}
