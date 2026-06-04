"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedCounter from "@/components/motion/AnimatedCounter";
import SectionHeading from "@/components/motion/SectionHeading";
import { PRODUCT_COUNT } from "@/data/products";
import { BRAND_TAGLINE } from "@/data/categories";
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
    content: `We Are A Client-Focused Engineering Firm With 25+ Years Of Experience, Committed To Precision, Dependable Service, And Building Lasting Partnerships Through Excellence. AEC Is A Pan-India Supplier Of Certified Lifting, Rigging, Hoists, And Material Handling Equipment, Serving Construction, Infrastructure, Marine, And Industrial Sectors From Our Howrah Headquarters And Regional Branches.`,
  },
  {
    id: "story",
    label: "Our Story",
    content: `Alamdaar Engineering Concern Was Established Over 25 Years Ago As A Howrah-Based Trading Firm Supplying Lifting And Rigging Hardware To Local Industry. Through Consistent Quality And Client Trust, We Grew Into A Multi-Branch Operation With Offices In Hyderabad And Chennai, Expanding Our Catalogue To Hoists, Winches, Material Handling Equipment, And Scaffolding/Mivan Shuttering Items. ${BRAND_TAGLINE}`,
  },
  {
    id: "commitment",
    label: "Our Commitment",
    content:
      "Our Commitment Is To Exceed Expectations Through On-Time Delivery, Exceptional Product Quality, And Comprehensive Solutions. We Provide After-Sales Support, Technical Guidance On Product Selection, And Reliable Stock Availability So Every Project Stays On Schedule — Ensuring Every Client's Success And Long-Term Satisfaction.",
  },
];

const stats = [
  { value: "25+", label: "Years" },
  { value: "3", label: "Branches" },
  { value: String(PRODUCT_COUNT), label: "Core Products" },
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
        <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-muted">
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
