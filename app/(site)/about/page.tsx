import type { Metadata } from "next";
import { BRAND_TAGLINE } from "@/data/categories";
import FounderMessage from "@/components/about/FounderMessage";
import CompanyOverview from "@/components/about/CompanyOverview";
import OurClients from "@/components/about/OurClients";
import OurCertifications from "@/components/about/OurCertifications";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Alamdaar Engineering Concern — lifting, rigging & material handling manufacturer in Howrah, West Bengal.",
};

export default function AboutPage() {
  return (
    <>
      <header className="bg-primary pb-16 pt-32 dark:bg-[#0a1018]">
        <article className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-bold uppercase text-white">
            About Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{BRAND_TAGLINE}</p>
        </article>
      </header>
      <FounderMessage />
      <CompanyOverview />
      <OurClients />
      <OurCertifications />
    </>
  );
}
