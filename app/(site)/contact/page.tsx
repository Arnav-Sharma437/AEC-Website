import type { Metadata } from "next";
import { BRAND_TAGLINE } from "@/data/categories";
import BranchCards from "@/components/contact/BranchCards";
import EnquiryForm from "@/components/contact/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Alamdaar Engineering Concern — Kolkata HO, Hyderabad, and Chennai branches.",
};

export default function ContactPage() {
  return (
    <>
      <header className="bg-primary pb-16 pt-32 dark:bg-[#0a1018]">
        <article className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-bold uppercase text-white">
            Contact Us
          </h1>
        </article>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <article className="mb-16 grid gap-12 lg:grid-cols-2">
          <section>
            <h2 className="mb-2 font-display text-2xl font-bold text-primary dark:text-foreground">
              Alamdaar Engineering Concern
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-accent">{BRAND_TAGLINE}</p>
            <ul className="space-y-4 text-muted">
              <li>
                <strong className="text-primary dark:text-foreground">Office:</strong>
                <br />
                4, I.R. Belilious Lane, Howrah 711101, West Bengal
              </li>
              <li>
                <strong className="text-primary dark:text-foreground">Factory:</strong>
                <br />
                Domjur Makardah
              </li>
              <li>
                <strong className="text-primary dark:text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:alamdaar.ropeclamps@gmail.com"
                  className="text-accent hover:underline"
                >
                  alamdaar.ropeclamps@gmail.com
                </a>
              </li>
              <li>
                <strong className="text-primary dark:text-foreground">GSTIN:</strong> 19AFRPA7937G1Z1
              </li>
            </ul>
          </section>
          <EnquiryForm />
        </article>
        <h2 className="mb-8 text-center font-display text-2xl font-bold uppercase text-primary dark:text-foreground">
          Our Branches
        </h2>
        <BranchCards />
        <div className="mt-16">
          <h2 className="mb-8 text-center font-display text-2xl font-bold uppercase text-primary dark:text-foreground">
            Our Location
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card p-2 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4532.657050548007!2d88.32565277599934!3d22.590949432296178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277f47adaf789%3A0xbca9d724b8d3a44c!2s4%2C%20Belilious%20Ln%2C%20Kadam%20Tala%2C%20Howrah%2C%20West%20Bengal%20711101!5e1!3m2!1sen!2sin!4v1782114196896!5m2!1sen!2sin"
              className="h-[450px] w-full rounded-lg border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
