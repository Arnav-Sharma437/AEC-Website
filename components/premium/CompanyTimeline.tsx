"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { COMPANY_TIMELINE } from "@/data/timeline";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";
import SectionHeading from "@/components/premium/SectionHeading";

export default function CompanyTimeline() {
  const enabled = usePremiumMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!enabled || !sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll(".timeline-card");
      cards.forEach((card, i) => {
        const fromX = i % 2 === 0 ? -80 : 80;
        gsap.set(card, {
          opacity: 0,
          x: fromX,
          rotateY: i % 2 === 0 ? -18 : 18,
          transformPerspective: 1000,
        });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              x: 0,
              rotateY: 0,
              duration: 0.85,
              ease: "power3.out",
            });
          },
        });
      });
    },
    { dependencies: [enabled], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="timeline-section relative overflow-hidden bg-background py-20"
    >
      <article className="relative mx-auto max-w-4xl px-4 lg:px-8">
        <SectionHeading
          title="Our Journey"
          subtitle="Twenty-five years of engineering excellence across India"
        />
        <div
          className={`relative space-y-10 ${enabled ? "timeline-perspective" : ""}`}
        >
          <div
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-accent/30 md:block"
            aria-hidden
          />
          {COMPANY_TIMELINE.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={item.year}
                className={`timeline-card relative flex md:w-1/2 ${
                  isLeft ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"
                }`}
              >
                <article
                  className={`w-full rounded-xl border border-border bg-card p-6 shadow-md ${
                    enabled ? "timeline-card-3d" : ""
                  } ${isLeft ? "md:text-right" : "md:text-left"}`}
                  data-cursor-hover
                >
                  <span className="font-display text-2xl font-bold text-accent">
                    {item.year}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-primary dark:text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </article>
                <span
                  className="absolute top-6 hidden h-3 w-3 rounded-full bg-accent md:block"
                  style={{
                    [isLeft ? "right" : "left"]: "-1.35rem",
                  }}
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
