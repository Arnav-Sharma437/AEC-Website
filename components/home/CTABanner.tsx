"use client";

import Link from "next/link";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import ScrollReveal from "@/components/premium/ScrollReveal";
import Magnetic from "@/components/premium/Magnetic";

export default function CTABanner() {
  return (
    <ScrollReveal className="bg-accent py-16">
      <article className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 font-display text-2xl font-bold text-primary md:text-3xl">
          Ready to source quality engineering equipment?
        </h2>
        <Magnetic>
          <Link
            href={buildGeneralWhatsAppUrl("919831046296")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md bg-primary px-8 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 ease-out hover:bg-secondary"
          >
            Contact Us on WhatsApp
          </Link>
        </Magnetic>
      </article>
    </ScrollReveal>
  );
}
