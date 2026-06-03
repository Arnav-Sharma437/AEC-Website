"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div";
}

export default function ScrollReveal({
  children,
  className,
  as: Tag = "section",
}: ScrollRevealProps) {
  const premium = usePremiumMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!premium || !ref.current) return;

      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { dependencies: [premium], scope: ref }
  );

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
