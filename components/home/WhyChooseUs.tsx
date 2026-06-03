"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/components/premium/SectionHeading";
import ScrollReveal from "@/components/premium/ScrollReveal";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

const reasons = [
  {
    icon: "🏭",
    title: "25+ Years Experience",
    desc: "Trusted partner since decades in industrial engineering",
  },
  {
    icon: "✅",
    title: "Certified Products",
    desc: "International quality standards and compliance",
  },
  {
    icon: "🚚",
    title: "Pan India Delivery",
    desc: "Kolkata, Hyderabad, and Chennai branches",
  },
  {
    icon: "🤝",
    title: "End-to-End Solutions",
    desc: "Not just a vendor — a long-term engineering partner",
  },
];

export default function WhyChooseUs() {
  const premium = usePremiumMotion();
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!premium || !listRef.current) return;
      const cards = listRef.current.querySelectorAll(".why-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.92, rotateY: i % 2 ? 12 : -12 },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    },
    { dependencies: [premium], scope: listRef }
  );

  return (
    <ScrollReveal className="bg-surface py-20 dark:bg-background">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Why Alamdaar Engineering?" />
        <ul ref={listRef} className="grid gap-8 sm:grid-cols-2">
          {reasons.map((item) => (
            <li
              key={item.title}
              className="why-card rounded-lg border border-border bg-card p-8 text-center shadow-sm transition-transform duration-300 hover:scale-[1.02]"
              data-cursor-hover
            >
              <span className="why-icon mb-4 block text-5xl">{item.icon}</span>
              <h3 className="mb-2 font-display text-xl font-semibold text-primary dark:text-foreground">
                {item.title}
              </h3>
              <p className="text-muted">{item.desc}</p>
            </li>
          ))}
        </ul>
      </article>
    </ScrollReveal>
  );
}
