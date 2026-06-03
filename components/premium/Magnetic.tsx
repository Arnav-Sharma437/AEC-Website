"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: MagneticProps) {
  const enabled = usePremiumMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(x, y);
      const max = Math.max(rect.width, rect.height) * 0.9;

      if (dist < max) {
        gsap.to(el, {
          x: x * strength * 0.25,
          y: y * strength * 0.25,
          duration: 0.45,
          ease: "power2.out",
        });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
      }
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, strength]);

  return (
    <div ref={ref} className={className} data-cursor-hover>
      {children}
    </div>
  );
}
