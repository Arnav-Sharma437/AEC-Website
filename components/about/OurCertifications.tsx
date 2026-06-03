"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { FileText } from "lucide-react";
import { certifications } from "@/data/certifications";
import CertificateModal from "@/components/ui/CertificateModal";
import SectionHeading from "@/components/premium/SectionHeading";
import ScrollReveal from "@/components/premium/ScrollReveal";
import { gsap, ScrollTrigger } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

export default function OurCertifications() {
  const premium = usePremiumMotion();
  const [selected, setSelected] = useState<(typeof certifications)[0] | null>(
    null
  );
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!premium || !gridRef.current) return;
      const cards = gridRef.current.querySelectorAll(".cert-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 36, rotateX: -12 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    },
    { dependencies: [premium], scope: gridRef }
  );

  return (
    <ScrollReveal className="bg-surface py-20 dark:bg-background">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Our Certifications" />
        <ul ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <li key={cert.id}>
              <button
                type="button"
                onClick={() => setSelected(cert)}
                className="cert-card flex w-full flex-col items-center rounded-lg border border-border bg-card p-8 text-center shadow-sm transition-[box-shadow,border-color,transform] duration-300 ease-out hover:border-accent hover:shadow-md hover:ring-2 hover:ring-accent/30 hover:-translate-y-1"
                data-cursor-hover
              >
                <FileText className="mb-4 h-16 w-16 text-accent" />
                <h3 className="mb-1 font-display font-semibold text-primary dark:text-foreground">
                  {cert.name}
                </h3>
                <p className="mb-4 text-sm text-muted">{cert.issuingBody}</p>
                <span className="text-sm font-semibold text-accent">
                  View Certificate →
                </span>
              </button>
            </li>
          ))}
        </ul>
      </article>
      <CertificateModal cert={selected} onClose={() => setSelected(null)} />
    </ScrollReveal>
  );
}
