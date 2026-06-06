"use client";

import type { Product } from "@/data/products";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ProductImage from "@/components/shop/ProductImage";

export default function FeaturedMarqueeCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
      <figure className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="280px"
          className="h-full w-full object-cover"
        />
      </figure>
      <section className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="mb-2 truncate font-condensed text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
          {product.category}
        </p>
        <h3 className="mb-3 line-clamp-2 flex-1 font-display text-sm font-semibold leading-snug text-primary dark:text-foreground sm:text-base">
          {product.name}
        </h3>
        <WhatsAppButton
          productName={product.name}
          category={product.category}
          compact
          className="mt-auto w-full text-xs sm:text-sm"
        />
      </section>
    </article>
  );
}
