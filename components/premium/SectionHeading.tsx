"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

function CharSplit({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="split-char inline-block"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const enabled = usePremiumMotion();
  const rootRef = useRef<HTMLElement>(null);
  const centered = align === "center";

  useGSAP(
    () => {
      if (!enabled || !rootRef.current) return;

      const chars = rootRef.current.querySelectorAll(".split-char");
      const line = rootRef.current.querySelector(".heading-accent");
      const sub = rootRef.current.querySelector(".heading-sub");

      gsap.set(chars, { opacity: 0, y: 24, rotateX: -40 });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.55,
            stagger: 0.025,
            ease: "power3.out",
          });
          if (line) {
            gsap.fromTo(
              line,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.7, ease: "power2.out", delay: 0.15 }
            );
          }
          if (sub) {
            gsap.fromTo(
              sub,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.35 }
            );
          }
        },
      });
    },
    { dependencies: [enabled, title, subtitle], scope: rootRef }
  );

  return (
    <header
      ref={rootRef}
      className={cn(
        "mb-12",
        centered && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      <h2
        className={cn(
          "font-display text-3xl font-bold uppercase text-primary dark:text-foreground md:text-4xl",
          enabled && "perspective-heading",
          titleClassName
        )}
      >
        {enabled ? (
          <CharSplit text={title} />
        ) : (
          title
        )}
      </h2>
      <div
        className={cn(
          "heading-accent mt-3 h-1 origin-left rounded-full bg-accent",
          centered ? "mx-auto w-16" : "w-16"
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "heading-sub mt-4 max-w-2xl text-muted",
            centered && "mx-auto",
            !enabled && "opacity-100"
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
