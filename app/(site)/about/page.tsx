import type { Metadata } from "next";
import FounderMessage from "@/components/about/FounderMessage";
import CompanyOverview from "@/components/about/CompanyOverview";
import OurClients from "@/components/about/OurClients";
import OurCertifications from "@/components/about/OurCertifications";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Alamdaar Engineering Concern — 25+ years of industrial engineering excellence across India.",
};

export default function AboutPage() {
  return (
    <>
      <header className="bg-primary pb-16 pt-32 dark:bg-[#0a1018]">
        <article className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-bold uppercase text-white">
            About Us
          </h1>
          <p className="mt-4 text-white/80">
            Driven by Innovation, Defined by Quality.
          </p>
        </article>
      </header>
      <FounderMessage />
      <CompanyOverview />
      <OurClients />
      <OurCertifications />
    </>
  );
}
