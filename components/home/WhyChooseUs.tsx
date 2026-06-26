"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  MapPin,
  Layers,
  Tag,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/motion/SectionHeading";
import {
  DURATION,
  EASE_OUT,
  fadeUp,
  staggerContainer,
  transition,
  VIEWPORT_ONCE,
} from "@/lib/motion";

const reasons: {
  num: number;
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    num: 1,
    icon: Award,
    title: "Trusted Since 1995",
    desc: "Over two decades of serving India's leading construction and industrial companies",
  },
  {
    num: 2,
    icon: BadgeCheck,
    title: "Certified & Compliant Products",
    desc: "All products meet international safety and quality standards",
  },
  {
    num: 3,
    icon: MapPin,
    title: "Pan India Presence",
    desc: "Branches in Kolkata, Hyderabad, and Chennai for faster service",
  },
  {
    num: 4,
    icon: Layers,
    title: "End-to-End Solutions",
    desc: "From lifting hardware to scaffolding — one supplier for all your needs",
  },
  {
    num: 5,
    icon: Tag,
    title: "Competitive Pricing",
    desc: "Best market rates without compromising on quality or safety",
  },
  {
    num: 6,
    icon: Headphones,
    title: "Dedicated After-Sales Support",
    desc: "Our team stays with you even after the sale is done",
  },
];

function ReasonBadge({ num, icon: Icon }: { num: number; icon: LucideIcon }) {
  return (
    <div
      className="relative mx-auto mb-5 flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full border-[3px] border-accent bg-white shadow-sm dark:bg-card"
      aria-hidden
    >
      <Icon className="h-7 w-7 text-accent" strokeWidth={2} />
      <span className="absolute -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent bg-accent font-display text-sm font-bold text-primary">
        {num}
      </span>
    </div>
  );
}

export default function WhyChooseUs() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-surface py-20 dark:bg-background">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Why Choose Alamdaar Engineering Concern?" />
        <motion.ul
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={VIEWPORT_ONCE}
        >
          {reasons.map((item, index) => (
            <motion.li
              key={item.title}
              initial={reduced ? false : fadeUp.hidden}
              whileInView={reduced ? undefined : fadeUp.visible}
              viewport={VIEWPORT_ONCE}
              transition={{
                ...transition(reduced, DURATION.medium),
                delay: reduced ? 0 : index * 0.08,
                ease: EASE_OUT,
              }}
              className="flex flex-col items-center"
            >
              <ReasonBadge num={item.num} icon={item.icon} />
              <article className="w-full rounded-xl border border-border/70 bg-white p-6 text-center shadow-sm dark:border-border dark:bg-card">
                <h3 className="mb-2 font-display text-lg font-semibold text-primary dark:text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </article>
    </section>
  );
}
