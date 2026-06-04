"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CATEGORIES } from "@/data/categories";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/motion/SectionHeading";
import { DURATION, EASE_OUT, fadeUp, transition, VIEWPORT_ONCE } from "@/lib/motion";

export default function CategoryGrid() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-surface py-20 dark:bg-background">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Our Product Range"
          subtitle="Five specialised categories for lifting, rigging & material handling"
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, index) => (
            <motion.li
              key={cat.slug}
              initial={reduced ? false : fadeUp.hidden}
              whileInView={reduced ? undefined : fadeUp.visible}
              viewport={VIEWPORT_ONCE}
              transition={{
                ...transition(reduced, DURATION.medium),
                delay: reduced ? 0 : index * 0.1,
                ease: EASE_OUT,
              }}
              whileHover={reduced ? undefined : { y: -5 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow duration-300 ease-out hover:border-accent hover:shadow-md"
              >
                <span className="mb-4 text-4xl">{cat.icon}</span>
                <h3 className="mb-2 font-display text-lg font-semibold text-primary group-hover:text-accent dark:text-foreground">
                  {cat.name}
                </h3>
                <p className="mb-4 flex-1 text-sm text-muted">{cat.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  View All <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </article>
    </section>
  );
}
