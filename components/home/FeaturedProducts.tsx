"use client";

import { useEffect, useState } from "react";
import { getFeaturedProducts, type Product } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";

function mapApiProduct(p: Record<string, unknown>): Product {
  return {
    id: String(p._id),
    name: String(p.name),
    category: String(p.categoryName || p.category),
    categorySlug: String(p.category),
    description: String(p.description || ""),
    image: String(p.image || ""),
    price: String(p.price || "XXX"),
    featured: true,
  };
}

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>(getFeaturedProducts());

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeatured(data.map(mapApiProduct));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-background py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase text-primary dark:text-foreground">
          Featured Products
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} compact />
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
