"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { clients } from "@/data/clients";
import SectionHeading from "@/components/premium/SectionHeading";
import ScrollReveal from "@/components/premium/ScrollReveal";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

export default function OurClients() {
  const premium = usePremiumMotion();
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!premium || !gridRef.current) return;
      const items = gridRef.current.querySelectorAll(".client-logo");
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { dependencies: [premium], scope: gridRef }
  );

  return (
    <ScrollReveal className="py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Our Trusted Clients" />
        <ul
          ref={gridRef}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
        >
          {clients.map((client) => (
            <li
              key={client.id}
              className="client-logo flex aspect-square flex-col items-center justify-center rounded-lg border border-border bg-surface p-4 grayscale transition-[filter] duration-300 ease-out hover:grayscale-0 hover:brightness-110 dark:bg-card"
              data-cursor-hover
            >
              <span className="mb-2 font-display text-2xl font-bold text-primary/30">
                {client.name.charAt(0)}
              </span>
              <p className="text-center text-xs font-medium text-muted">
                {client.name}
              </p>
            </li>
          ))}
        </ul>
      </article>
    </ScrollReveal>
  );
}
