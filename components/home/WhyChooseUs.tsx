"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/motion/SectionHeading";
import {
  DURATION,
  EASE_OUT,
  scaleIn,
  staggerContainer,
  transition,
  VIEWPORT_ONCE,
} from "@/lib/motion";

const reasons = [
  {
    icon: "🏭",
    title: "25+ Years Experience",
    desc: "Trusted partner since decades in industrial engineering",
  },
  {
    icon: "✅",
    title: "Certified Products",
    desc: "International quality standards and compliance",
  },
  {
    icon: "🚚",
    title: "Pan India Delivery",
    desc: "Kolkata, Hyderabad, and Chennai branches",
  },
  {
    icon: "🤝",
    title: "End-to-End Solutions",
    desc: "Not just a vendor — a long-term engineering partner",
  },
];

export default function WhyChooseUs() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-surface py-20 dark:bg-background">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Why Alamdaar Engineering?" />
        <motion.ul
          className="grid gap-8 sm:grid-cols-2"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={VIEWPORT_ONCE}
        >
          {reasons.map((item) => (
            <motion.li
              key={item.title}
              variants={scaleIn}
              transition={{ duration: DURATION.medium, ease: EASE_OUT }}
              className="rounded-lg border border-border bg-card p-8 text-center shadow-sm"
            >
              <motion.span
                className="mb-4 block text-5xl"
                whileHover={
                  reduced
                    ? undefined
                    : {
                        scale: [1, 1.12, 1],
                        transition: { duration: 0.45, ease: "easeOut" },
                      }
                }
              >
                {item.icon}
              </motion.span>
              <h3 className="mb-2 font-display text-xl font-semibold text-primary dark:text-foreground">
                {item.title}
              </h3>
              <p className="text-muted">{item.desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </article>
    </section>
  );
}
