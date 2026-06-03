"use client";

import { motion, useReducedMotion } from "framer-motion";
import { clients } from "@/data/clients";
import SectionHeading from "@/components/motion/SectionHeading";
import { DURATION, EASE_OUT, fadeIn, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";

export default function OurClients() {
  const reduced = useReducedMotion();

  return (
    <section className="py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Our Trusted Clients" />
        <motion.ul
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={VIEWPORT_ONCE}
        >
          {clients.map((client) => (
            <motion.li
              key={client.id}
              variants={fadeIn}
              transition={{ duration: DURATION.medium, ease: EASE_OUT }}
              whileHover={
                reduced
                  ? undefined
                  : { filter: "grayscale(0) brightness(1.05)" }
              }
              className="flex aspect-square flex-col items-center justify-center rounded-lg border border-border bg-surface p-4 grayscale transition-[filter] duration-300 ease-out hover:grayscale-0 dark:bg-card"
            >
              <span className="mb-2 font-display text-2xl font-bold text-primary/30 transition-colors duration-300 group-hover:text-primary/60">
                {client.name.charAt(0)}
              </span>
              <p className="text-center text-xs font-medium text-muted">
                {client.name}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </article>
    </section>
  );
}
