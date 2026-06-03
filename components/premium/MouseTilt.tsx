"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

interface MouseTiltProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export default function MouseTilt({
  children,
  className = "",
  maxTilt = 8,
}: MouseTiltProps) {
  const enabled = usePremiumMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: x * maxTilt,
        rotateX: -y * maxTilt,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 900,
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, maxTilt]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
