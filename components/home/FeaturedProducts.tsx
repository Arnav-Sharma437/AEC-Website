"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { getFeaturedProducts } from "@/data/products";
import {
  FEATURED_CAROUSEL_1_IDS,
  FEATURED_CAROUSEL_2_IDS,
  FEATURED_PRODUCT_IDS,
} from "@/data/featured";
import { fetchPublicProducts } from "@/lib/products-api";
import FeaturedProductCarousel from "@/components/home/FeaturedProductCarousel";
import SectionHeading from "@/components/motion/SectionHeading";

function orderFeatured(list: Product[], ids: readonly string[]): Product[] {
  return ids.map((id) => list.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProducts({ featured: "true" })
      .then((list) => {
        const ordered = orderFeatured(list, FEATURED_PRODUCT_IDS);
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

  const carousel1 = useMemo(
    () => orderFeatured(featured, FEATURED_CAROUSEL_1_IDS),
    [featured]
  );
  const carousel2 = useMemo(
    () => orderFeatured(featured, FEATURED_CAROUSEL_2_IDS),
    [featured]
  );

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
          <div className="space-y-14 md:space-y-16">
            <FeaturedProductCarousel
              title="Lifting & Hoisting Solutions"
              products={carousel1}
            />
            <FeaturedProductCarousel
              title="Handling & Rigging Essentials"
              products={carousel2}
            />
          </div>
        )}
      </article>
    </section>
  );
}
