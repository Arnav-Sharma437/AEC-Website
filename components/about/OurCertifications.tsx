"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText } from "lucide-react";
import { certifications } from "@/data/certifications";
import CertificateModal from "@/components/ui/CertificateModal";
import SectionHeading from "@/components/motion/SectionHeading";
import { DURATION, EASE_OUT, fadeIn, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";

export default function OurCertifications() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<(typeof certifications)[0] | null>(
    null
  );

  return (
    <section className="bg-surface py-20 dark:bg-background">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Our Certifications" />
        <motion.ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={VIEWPORT_ONCE}
        >
          {certifications.map((cert) => (
            <motion.li
              key={cert.id}
              variants={fadeIn}
              transition={{ duration: DURATION.medium, ease: EASE_OUT }}
            >
              <motion.button
                type="button"
                onClick={() => setSelected(cert)}
                className="flex w-full flex-col items-center rounded-lg border border-border bg-card p-8 text-center shadow-sm transition-[box-shadow,border-color] duration-300 ease-out hover:border-accent hover:shadow-md hover:ring-2 hover:ring-accent/30"
                whileHover={reduced ? undefined : { y: -4 }}
              >
                <FileText className="mb-4 h-16 w-16 text-accent" />
                <h3 className="mb-1 font-display font-semibold text-primary dark:text-foreground">
                  {cert.name}
                </h3>
                <p className="mb-4 text-sm text-muted">{cert.issuingBody}</p>
                <span className="text-sm font-semibold text-accent">
                  View Certificate →
                </span>
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
      </article>
      <CertificateModal cert={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
