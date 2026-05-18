"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { certifications } from "@/data/certifications";
import CertificateModal from "@/components/ui/CertificateModal";

export default function OurCertifications() {
  const [selected, setSelected] = useState<(typeof certifications)[0] | null>(
    null
  );

  return (
    <section className="bg-surface py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase text-primary">
          Our Certifications
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <li key={cert.id}>
              <button
                type="button"
                onClick={() => setSelected(cert)}
                className="flex w-full flex-col items-center rounded-lg border border-border bg-white p-8 text-center shadow-sm transition hover:border-accent hover:shadow-md"
              >
                <FileText className="mb-4 h-16 w-16 text-accent" />
                <h3 className="mb-1 font-display font-semibold text-primary">
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
    </section>
  );
}
