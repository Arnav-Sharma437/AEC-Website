import { Suspense } from "react";
import type { Metadata } from "next";
import ShopContent from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse 10,000+ industrial products — material handling, lifting equipment, scaffolding, PPE and more.",
};

export default function ShopPage() {
  return (
    <>
      <header className="bg-primary pb-16 pt-32">
        <article className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-bold uppercase text-white md:text-5xl">
            Product Catalogue
          </h1>
          <p className="mt-4 text-white/80">
            Get a quote via WhatsApp — no online checkout required
          </p>
        </article>
      </header>
      <Suspense fallback={<p className="py-12 text-center">Loading products...</p>}>
        <ShopContent />
      </Suspense>
    </>
  );
}
