"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import {
  formatStatCount,
  parseStatValue,
} from "@/lib/premium/motion";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

interface GsapCounterProps {
  value: string;
  className?: string;
}

export default function GsapCounter({ value, className }: GsapCounterProps) {
  const enabled = usePremiumMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parseStatValue(value);
  const [display, setDisplay] = useState(value);

  useGSAP(
    () => {
      if (!ref.current) return;

      if (!enabled || !parsed.isNumeric) {
        setDisplay(value);
        return;
      }

      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: parsed.target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              setDisplay(
                `${formatStatCount(Math.round(counter.val), parsed.useCommas)}${parsed.suffix}`
              );
            },
          });
        },
      });
    },
    { dependencies: [enabled, value], scope: ref }
  );

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
