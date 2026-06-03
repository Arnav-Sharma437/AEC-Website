"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { CATEGORIES } from "@/data/categories";
import FlipCategoryCard from "@/components/premium/FlipCategoryCard";
import SectionHeading from "@/components/premium/SectionHeading";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

export default function CategoryGrid() {
  const premium = usePremiumMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!premium || !sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 0.8,
        onUpdate: (self) => {
          gsap.set(sectionRef.current, {
            opacity: 0.35 + self.progress * 0.65,
          });
        },
      });
    },
    { dependencies: [premium], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="category-section bg-surface py-20 dark:bg-background"
    >
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Our Product Range" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <FlipCategoryCard category={cat} />
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
