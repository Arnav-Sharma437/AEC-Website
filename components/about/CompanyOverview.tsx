"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedCounter from "@/components/motion/AnimatedCounter";
import SectionHeading from "@/components/motion/SectionHeading";
import {
  DURATION,
  EASE_OUT,
  fadeIn,
  staggerContainer,
  transition,
  VIEWPORT_ONCE,
} from "@/lib/motion";

const tabs = [
  {
    id: "who",
    label: "Who We Are",
    content:
      "We are a client-focused engineering firm with 25+ years of experience, committed to precision, dependable service, and building lasting partnerships through excellence.",
  },
  {
    id: "story",
    label: "Our Story",
    content:
      "Alamdaar Engineering Concern was established over 25 years ago with a clear purpose: to deliver dependable, high-quality solutions in material handling, scaffolding, rigging, and lifting equipment across India.",
  },
  {
    id: "commitment",
    label: "Our Commitment",
    content:
      "Our commitment is to exceed expectations through on-time delivery, exceptional quality, and comprehensive solutions, ensuring every project's success and client satisfaction.",
  },
];

const stats = [
  { value: "25+", label: "Years" },
  { value: "3", label: "Branches" },
  { value: "10,000+", label: "Products" },
  { value: "100+", label: "Clients" },
];

export default function CompanyOverview() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState("who");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section className="bg-surface py-20 dark:bg-background">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="About Alamdaar Engineering Concern" />
        <nav className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`rounded-md px-4 py-2 font-display text-sm font-semibold uppercase transition ${
                active === tab.id
                  ? "bg-primary text-white"
                  : "bg-card text-primary hover:bg-accent hover:text-primary dark:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-muted leading-relaxed">
          {current.content}
        </p>
        <motion.ul
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={VIEWPORT_ONCE}
        >
          {stats.map((s) => (
            <motion.li
              key={s.label}
              variants={fadeIn}
              transition={{ duration: DURATION.medium, ease: EASE_OUT }}
              className="rounded-lg bg-card p-6 text-center shadow-sm"
            >
              <p className="font-display text-3xl font-bold text-accent">
                <AnimatedCounter value={s.value} />
              </p>
              <p className="text-sm uppercase text-muted">{s.label}</p>
            </motion.li>
          ))}
        </motion.ul>
      </article>
    </section>
  );
}
