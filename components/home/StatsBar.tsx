"use client";

import { motion, useReducedMotion } from "framer-motion";
import AnimatedCounter from "@/components/motion/AnimatedCounter";
import {
  DURATION,
  EASE_OUT,
  fadeIn,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motion";

const stats = [
  { value: "25+", label: "Years Experience" },
  { value: "10,000+", label: "Products" },
  { value: "3", label: "Branches Pan India" },
  { value: "ISO", label: "Certified" },
];

export default function StatsBar() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-primary py-10">
      <motion.ul
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 lg:px-8"
        variants={staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={VIEWPORT_ONCE}
      >
        {stats.map((stat) => (
          <motion.li
            key={stat.label}
            variants={fadeIn}
            transition={{ duration: DURATION.medium, ease: EASE_OUT }}
            className="text-center"
          >
            <p className="font-display text-3xl font-bold text-accent md:text-4xl">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="mt-1 text-sm uppercase tracking-wide text-white/80">
              {stat.label}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
