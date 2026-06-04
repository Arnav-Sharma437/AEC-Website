import { Suspense } from "react";
import type { Metadata } from "next";
import { BRAND_TAGLINE } from "@/data/categories";
import { PRODUCT_COUNT } from "@/data/products";
import ShopContent from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop",
  description: `Browse ${PRODUCT_COUNT}+ lifting, rigging & material handling products from AEC.`,
};

export default function ShopPage() {
  return (
    <>
      <header className="bg-primary pb-16 pt-32 dark:bg-[#0a1018]">
        <article className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-display text-4xl font-bold uppercase text-white md:text-5xl">
            Product Catalogue
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{BRAND_TAGLINE}</p>
        </article>
      </header>
      <Suspense fallback={<p className="py-12 text-center">Loading products...</p>}>
        <ShopContent />
      </Suspense>
    </>
  );
}
