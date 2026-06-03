"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import GsapCounter from "@/components/premium/GsapCounter";
import GradientMesh from "@/components/premium/GradientMesh";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

const stats = [
  { value: "25+", label: "Years Experience" },
  { value: "10,000+", label: "Products" },
  { value: "3", label: "Branches Pan India" },
  { value: "ISO", label: "Certified" },
];

export default function StatsBar() {
  const premium = usePremiumMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!premium || !sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll(".stat-card");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=35%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, z: -40 },
          {
            opacity: 1,
            y: 0,
            z: 0,
            duration: 0.7,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            z: 24,
            rotateX: -4,
            scale: 1.03,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 800,
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            z: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    },
    { dependencies: [premium], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="stats-section relative overflow-hidden bg-primary py-14"
    >
      <GradientMesh />
      <ul className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className={`stat-card text-center ${premium ? "stat-card-3d" : ""}`}
            data-cursor-hover
          >
            <p className="font-display text-3xl font-bold text-accent md:text-4xl">
              <GsapCounter value={stat.value} />
            </p>
            <p className="mt-1 text-sm uppercase tracking-wide text-white/80">
              {stat.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
