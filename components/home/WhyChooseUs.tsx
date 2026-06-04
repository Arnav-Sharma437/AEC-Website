"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Truck,
  Layers,
  Tag,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/motion/SectionHeading";
import {
  DURATION,
  EASE_OUT,
  scaleIn,
  staggerContainer,
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
    title: "25+ Years Experience",
    desc: "Trusted Partner Since Decades In Industrial Engineering",
  },
  {
    num: 2,
    icon: BadgeCheck,
    title: "Certified Products",
    desc: "International Quality Standards And Compliance",
  },
  {
    num: 3,
    icon: Truck,
    title: "Pan India Delivery",
    desc: "Kolkata, Hyderabad, And Chennai Branches",
  },
  {
    num: 4,
    icon: Layers,
    title: "End-to-End Solutions",
    desc: "Not Just A Vendor — A Long-Term Engineering Partner",
  },
  {
    num: 5,
    icon: Tag,
    title: "Competitive Pricing",
    desc: "Best Value Without Compromising Quality",
  },
  {
    num: 6,
    icon: Headphones,
    title: "After Sales Support",
    desc: "Dedicated Support For Every Client",
  },
];

function ReasonBadge({ num, icon: Icon }: { num: number; icon: LucideIcon }) {
  return (
    <div
      className="mx-auto mb-5 flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full border-[3px] border-accent bg-surface shadow-sm dark:bg-background"
      aria-hidden
    >
      <Icon className="h-6 w-6 text-accent" strokeWidth={2} />
      <span className="mt-1 font-display text-base font-bold text-primary dark:text-foreground">
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
        <SectionHeading title="Why Alamdaar Engineering?" />
        <motion.ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
              className="rounded-xl border border-border/80 bg-card/80 p-8 text-center shadow-sm backdrop-blur-sm"
            >
              <ReasonBadge num={item.num} icon={item.icon} />
              <h3 className="mb-2 font-display text-lg font-semibold text-primary dark:text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </article>
    </section>
  );
}
