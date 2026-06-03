"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

export default function GradientMesh() {
  const enabled = usePremiumMotion();
  const meshRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!enabled || !meshRef.current) return;
      gsap.to(meshRef.current, {
        backgroundPosition: "80% 40%",
        duration: 12,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    },
    { dependencies: [enabled] }
  );

  if (!enabled) return null;

  return (
    <div
      ref={meshRef}
      className="gradient-mesh pointer-events-none absolute inset-0 opacity-40"
      aria-hidden
    />
  );
}
