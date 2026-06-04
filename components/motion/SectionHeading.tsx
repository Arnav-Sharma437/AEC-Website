"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE_OUT, VIEWPORT_ONCE, transition } from "@/lib/motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  /** White text for dark section backgrounds */
  light?: boolean;
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const reduced = useReducedMotion();
  const centered = align === "center";

  return (
    <header
      className={cn(
        "mb-12",
        centered && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, x: -24 }}
        whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={transition(reduced, DURATION.medium)}
      >
        <h2
          className={cn(
            "font-display text-3xl font-bold uppercase md:text-4xl",
            light ? "text-white" : "text-primary dark:text-foreground",
            titleClassName
          )}
        >
          {title}
        </h2>
        <motion.div
          className={cn(
            "mt-3 h-1 origin-left rounded-full bg-accent",
            centered ? "mx-auto w-16" : "w-16"
          )}
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{
            ...transition(reduced, DURATION.slow),
            delay: reduced ? 0 : 0.12,
            ease: EASE_OUT,
          }}
        />
      </motion.div>
      {subtitle && (
        <motion.p
          className={cn(
            "mt-4 max-w-2xl",
            light ? "text-white/75" : "text-muted",
            centered && "mx-auto"
          )}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{
            ...transition(reduced, DURATION.medium),
            delay: reduced ? 0 : 0.2,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </header>
  );
}
