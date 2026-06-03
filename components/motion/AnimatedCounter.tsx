"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { DURATION, VIEWPORT_ONCE } from "@/lib/motion";

function parseStatValue(value: string): {
  isNumeric: boolean;
  target: number;
  suffix: string;
  useCommas: boolean;
} {
  const useCommas = value.includes(",");
  const normalized = value.replace(/,/g, "");
  const match = normalized.match(/^(\d+)(.*)$/);
  if (!match) {
    return { isNumeric: false, target: 0, suffix: "", useCommas: false };
  }
  return {
    isNumeric: true,
    target: parseInt(match[1], 10),
    suffix: match[2] ?? "",
    useCommas,
  };
}

function formatCount(n: number, useCommas: boolean): string {
  if (useCommas) return n.toLocaleString("en-US");
  return String(n);
}

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export default function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT_ONCE);
  const reduced = useReducedMotion();
  const parsed = parseStatValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    if (!parsed.isNumeric || reduced) {
      setDisplay(value);
      return;
    }

    const durationMs = DURATION.slow * 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = 1 - (1 - t) ** 3;
      const current = Math.round(parsed.target * eased);
      setDisplay(`${formatCount(current, parsed.useCommas)}${parsed.suffix}`);
      if (t < 1) requestAnimationFrame(tick);
    };

    setDisplay(`${formatCount(0, parsed.useCommas)}${parsed.suffix}`);
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [inView, reduced, value, parsed.isNumeric, parsed.target, parsed.suffix, parsed.useCommas]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
