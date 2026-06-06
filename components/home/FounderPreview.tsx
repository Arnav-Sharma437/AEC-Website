"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import FounderPortrait from "@/components/about/FounderPortrait";
import { FOUNDER } from "@/data/founder";
import {
  DURATION,
  EASE_OUT,
  fadeUp,
  slideFromLeft,
  slideFromRight,
  transition,
  VIEWPORT_ONCE,
} from "@/lib/motion";

export default function FounderPreview() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-[#0a0f14] py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1218] shadow-2xl"
          initial={reduced ? false : fadeUp.hidden}
          whileInView={reduced ? undefined : fadeUp.visible}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: DURATION.medium, ease: EASE_OUT }}
        >
          <div className="grid items-center gap-10 p-6 md:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12">
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={reduced ? false : slideFromLeft.hidden}
              whileInView={reduced ? undefined : slideFromLeft.visible}
              viewport={VIEWPORT_ONCE}
              transition={transition(reduced, DURATION.medium)}
            >
              <FounderPortrait />
            </motion.div>

            <motion.div
              initial={reduced ? false : slideFromRight.hidden}
              whileInView={reduced ? undefined : slideFromRight.visible}
              viewport={VIEWPORT_ONCE}
              transition={transition(reduced, DURATION.medium)}
            >
              <p className="mb-2 font-condensed text-sm font-semibold uppercase tracking-widest text-accent">
                Founder&apos;s Message
              </p>
              <h2 className="mb-2 font-display text-2xl font-bold text-white md:text-3xl">
                {FOUNDER.name}
              </h2>
              <p className="mb-6 text-sm text-white/70 md:text-base">{FOUNDER.designation}</p>
              <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-white/80 md:text-base">
                {FOUNDER.preview}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-primary transition hover:bg-accent-dark hover:text-white"
              >
                Read Full Message
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </article>
    </section>
  );
}
