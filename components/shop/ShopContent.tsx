"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { fetchPublicProducts, getStaticProductsFallback } from "@/lib/products-api";
import { CATEGORIES } from "@/data/categories";
import ProductCard from "./ProductCard";
import { Search, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-9 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export default function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    fetchPublicProducts()
      .then((list) => setProducts(list.length > 0 ? list : getStaticProductsFallback()))
      .catch(() => setProducts(getStaticProductsFallback()))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory) {
      result = result.filter((p) => p.categorySlug === activeCategory);
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
  }, [activeCategory, query, products]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, query]);

  function selectCategory(slug: string) {
    setActiveCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold uppercase text-primary dark:text-foreground md:text-4xl">
          Product Catalogue
        </h1>
        <p className="mt-2 text-muted">
          Lifting, Rigging &amp; Material Handling Equipment — Alamdaar Engineering Concern
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <p className="text-sm text-muted">
          Showing <strong className="text-primary dark:text-foreground">{visible.length}</strong> of{" "}
          <strong className="text-primary dark:text-foreground">{filtered.length}</strong> products
        </p>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => selectCategory("")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
            !activeCategory
              ? "bg-accent text-primary shadow-md"
              : "border border-border bg-card text-muted hover:border-accent/50"
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => selectCategory(cat.slug)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              activeCategory === cat.slug
                ? "bg-accent text-primary shadow-md"
                : "border border-border bg-card text-muted hover:border-accent/50"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <PackageOpen className="mb-4 h-14 w-14 text-muted/50" />
          <h2 className="font-display text-lg font-semibold text-primary dark:text-foreground">
            No products in this category
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Try another category or clear your search to browse the full catalogue.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              selectCategory("");
            }}
            className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-primary"
          >
            View all products
          </button>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((product, index) => (
              <li key={product.id} className="h-full">
                <ProductCard product={product} variant="grid" index={index % 12} />
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-lg border-2 border-primary bg-card px-8 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white dark:border-foreground dark:text-foreground dark:hover:bg-foreground dark:hover:text-primary"
              >
                Load more products
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
