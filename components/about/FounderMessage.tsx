"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import FounderPhotoTilt from "@/components/premium/FounderPhotoTilt";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

export default function FounderMessage() {
  const premium = usePremiumMotion();
  const textRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!premium || !textRef.current) return;
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: 64, rotateY: 18 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { dependencies: [premium], scope: textRef }
  );

  return (
    <section className="py-20">
      <article className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <FounderPhotoTilt />
        <section ref={textRef} className={premium ? "founder-text-3d" : undefined}>
          <p className="mb-2 font-condensed text-sm font-semibold uppercase tracking-widest text-accent">
            Founder&apos;s Message
          </p>
          <h2 className="mb-2 font-display text-2xl font-bold text-primary dark:text-foreground">
            Mr. Hozefa Yusuf Ali Dhinojwala
          </h2>
          <p className="mb-6 text-muted">
            Founder & Principal Advisor, Alamdaar Engineering Concern
          </p>
          <blockquote className="space-y-4 text-muted leading-relaxed">
            <p>
              When I established Alamdaar Engineering Concern more than 25 years ago,
              it was with a firm belief that quality, reliability, and client trust are
              the cornerstones of a successful engineering business.
            </p>
            <p>
              Over the decades, we have grown from a small trading firm into a
              pan-India engineering solutions provider, serving clients across
              construction, infrastructure, marine, and industrial sectors with
              material handling, scaffolding, rigging, and lifting equipment.
            </p>
            <p>
              Our commitment remains unchanged: to deliver dependable, high-quality
              products backed by exceptional service. Every partnership we build is
              founded on integrity, precision, and a shared vision for project success.
            </p>
          </blockquote>
        </section>
      </article>
    </section>
  );
}
