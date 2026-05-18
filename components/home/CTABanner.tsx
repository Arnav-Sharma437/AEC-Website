import Link from "next/link";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function CTABanner() {
  return (
    <section className="bg-accent py-16">
      <article className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 font-display text-2xl font-bold text-primary md:text-3xl">
          Ready to source quality engineering equipment?
        </h2>
        <Link
          href={buildGeneralWhatsAppUrl("919831046296")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-md bg-primary px-8 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-secondary"
        >
          Contact Us on WhatsApp
        </Link>
      </article>
    </section>
  );
}
