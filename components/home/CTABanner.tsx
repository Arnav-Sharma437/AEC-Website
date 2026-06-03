"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { DURATION, fadeUp, transition, VIEWPORT_ONCE } from "@/lib/motion";

export default function CTABanner() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-accent py-16">
      <motion.article
        className="mx-auto max-w-4xl px-4 text-center"
        initial={reduced ? false : fadeUp.hidden}
        whileInView={reduced ? undefined : fadeUp.visible}
        viewport={VIEWPORT_ONCE}
        transition={transition(reduced, DURATION.medium)}
      >
        <h2 className="mb-6 font-display text-2xl font-bold text-primary md:text-3xl">
          Ready to source quality engineering equipment?
        </h2>
        <Link
          href={buildGeneralWhatsAppUrl("919831046296")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-md bg-primary px-8 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 ease-out hover:bg-secondary"
        >
          Contact Us on WhatsApp
        </Link>
      </motion.article>
    </section>
  );
}
