"use client";

import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    if (!enabled || !parsed.isNumeric) {
      setDisplay(value);
    }
  }, [enabled, value, parsed.isNumeric]);

  useGSAP(
    () => {
      if (!enabled || !ref.current || !parsed.isNumeric) return;

      const counter = { val: 0 };
      const tween = gsap.to(counter, {
        val: parsed.target,
        duration: 1.4,
        ease: "power2.out",
        paused: true,
        onUpdate: () => {
          setDisplay(
            `${formatStatCount(Math.round(counter.val), parsed.useCommas)}${parsed.suffix}`
          );
        },
      });

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => tween.play(),
      });

      return () => {
        tween.kill();
        trigger.kill();
      };
    },
    {
      dependencies: [enabled, value, parsed.target, parsed.suffix, parsed.useCommas],
      scope: ref,
    }
  );

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
