import type { Metadata } from "next";
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
            <p className="mb-6 text-accent italic">
              Driven by Innovation, Defined by Quality.
            </p>
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
      </section>
    </>
  );
}
