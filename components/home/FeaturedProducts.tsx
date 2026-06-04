"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { getFeaturedProducts } from "@/data/products";
import { FEATURED_PRODUCT_IDS } from "@/data/featured";
import { fetchPublicProducts } from "@/lib/products-api";
import ProductCard from "@/components/shop/ProductCard";
import SectionHeading from "@/components/motion/SectionHeading";

function orderFeatured(list: Product[]): Product[] {
  return FEATURED_PRODUCT_IDS.map((id) => list.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p)
  );
}

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProducts({ featured: "true" })
      .then((list) => {
        const ordered = orderFeatured(list);
        if (ordered.length >= 4) {
          setFeatured(ordered);
        } else {
          setFeatured(getFeaturedProducts());
        }
      })
      .catch(() => {
        setFeatured(getFeaturedProducts());
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-background py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Featured Products"
          subtitle="Core Lifting, Rigging, Hoists, And Material Handling Equipment"
        />
        {loading ? (
          <p className="text-center text-muted">Loading featured products...</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} variant="grid" index={index} />
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
