"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { fetchPublicProducts, getStaticProductsFallback } from "@/lib/products-api";
import ProductCard from "@/components/shop/ProductCard";
import SectionHeading from "@/components/premium/SectionHeading";
import ScrollReveal from "@/components/premium/ScrollReveal";

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProducts({ featured: "true" })
      .then((list) => {
        if (list.length > 0) {
          setFeatured(list);
        } else {
          setFeatured(getStaticProductsFallback().filter((p) => p.featured));
        }
      })
      .catch(() => {
        setFeatured(getStaticProductsFallback().filter((p) => p.featured));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollReveal className="bg-background py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Featured Products" />
        {loading ? (
          <p className="text-center text-muted">Loading featured products...</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} variant="grid" />
              </li>
            ))}
          </ul>
        )}
      </article>
    </ScrollReveal>
  );
}
