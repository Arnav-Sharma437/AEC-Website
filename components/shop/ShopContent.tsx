"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { fetchPublicProducts, getStaticProductsFallback } from "@/lib/products-api";
import { CATEGORIES } from "@/data/categories";
import ProductCard from "./ProductCard";
import { Search } from "lucide-react";

export default function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const [selected, setSelected] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProducts()
      .then((list) => {
        setProducts(list.length > 0 ? list : getStaticProductsFallback());
      })
      .catch(() => setProducts(getStaticProductsFallback()))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (selected.length > 0) {
      result = result.filter((p) => selected.includes(p.categorySlug));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selected, query, products]);

  const toggleCategory = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row lg:px-8">
      <aside className="lg:w-64 lg:shrink-0">
        <h2 className="mb-4 font-display text-lg font-semibold uppercase text-primary dark:text-foreground">
          Categories
        </h2>
        <ul className="space-y-2 rounded-lg border border-border bg-card p-4 lg:sticky lg:top-24">
          <li>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.length === 0}
                onChange={() => setSelected([])}
                className="accent-accent"
              />
              All Categories
            </label>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="accent-accent"
                />
                {cat.name}
              </label>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">
            <strong className="text-primary dark:text-foreground">
              {filtered.length}
            </strong>{" "}
            products found
          </p>
          <label className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </label>
        </header>
        {loading ? (
          <p className="py-12 text-center text-muted">Loading products...</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {filtered.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-muted">
            No products match your filters.
          </p>
        )}
      </main>
    </section>
  );
}
