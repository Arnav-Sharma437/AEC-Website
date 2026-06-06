"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/data/products";
import { fetchPublicProducts, getStaticProductsFallback } from "@/lib/products-api";
import {
  CATEGORIES,
  getCategoryBySlug,
  getSubCategoriesByCategory,
  getSubCategoryBySlug,
  isEnquiryOnlyCategory,
} from "@/data/categories";
import CategoryImage from "@/components/home/CategoryImage";
import ProductCard from "./ProductCard";
import { Search, PackageOpen, ChevronRight, ArrowRight, MessageCircle } from "lucide-react";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { branches } from "@/data/branches";

const PAGE_SIZE = 12;

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-9 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium text-primary transition hover:text-accent dark:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-accent">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const subParam = searchParams.get("sub") ?? "";

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activeCategory = getCategoryBySlug(categoryParam);
  const activeSub = subParam
    ? getSubCategoryBySlug(categoryParam, subParam)
    : undefined;

  const view = useMemo(() => {
    if (query.trim()) return "search" as const;
    if (!categoryParam) return "main" as const;
    if (isEnquiryOnlyCategory(categoryParam)) return "enquiry" as const;
    if (!subParam) return "subcategories" as const;
    return "products" as const;
  }, [categoryParam, subParam, query]);

  useEffect(() => {
    fetchPublicProducts()
      .then((list) => setProducts(list.length > 0 ? list : getStaticProductsFallback()))
      .catch(() => setProducts(getStaticProductsFallback()))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (view === "search") {
      const q = query.toLowerCase();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (view === "products" && activeSub) {
      return products.filter(
        (p) => p.categorySlug === categoryParam && p.subCategorySlug === subParam
      );
    }
    return [];
  }, [view, query, products, categoryParam, subParam, activeSub]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [categoryParam, subParam, query, view]);

  function navigate(next: { category?: string; sub?: string }) {
    const params = new URLSearchParams();
    if (next.category) params.set("category", next.category);
    if (next.sub) params.set("sub", next.sub);
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  const breadcrumbs = useMemo(() => {
    const items: { label: string; href?: string }[] = [{ label: "Shop", href: "/shop" }];
    if (activeCategory) {
      items.push({
        label: activeCategory.name,
        href: subParam ? `/shop?category=${activeCategory.slug}` : undefined,
      });
    }
    if (activeSub) {
      items.push({ label: activeSub.name });
    }
    return items;
  }, [activeCategory, activeSub, subParam]);

  const headOfficeWhatsApp = branches[0]?.contacts[0]?.number;

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

      {view !== "main" && <Breadcrumbs items={breadcrumbs} />}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
        {(view === "products" || view === "search") && (
          <p className="text-sm text-muted">
            Showing{" "}
            <strong className="text-primary dark:text-foreground">{visible.length}</strong> of{" "}
            <strong className="text-primary dark:text-foreground">{filtered.length}</strong>{" "}
            products
          </p>
        )}
      </div>

      {loading ? (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      ) : view === "main" ? (
        <>
          <p className="mb-6 text-sm text-muted">Select a main category to browse the catalogue.</p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => navigate({ category: cat.slug })}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition hover:border-accent hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                    <CategoryImage
                      imageFile={cat.imageFile}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="mb-2 font-display text-lg font-semibold text-primary group-hover:text-accent dark:text-foreground">
                      {cat.name}
                    </h2>
                    <p className="mb-4 flex-1 text-sm text-muted">{cat.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      Browse <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : view === "enquiry" && activeCategory ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
          <MessageCircle className="mx-auto mb-4 h-14 w-14 text-accent" />
          <h2 className="font-display text-2xl font-bold text-primary dark:text-foreground">
            {activeCategory.name}
          </h2>
          <p className="mt-4 text-muted">{activeCategory.description}</p>
          <p className="mt-4 text-sm text-muted">
            This range is available on enquiry. Contact our team for specifications, pricing, and
            project support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {headOfficeWhatsApp && (
              <a
                href={buildGeneralWhatsAppUrl(headOfficeWhatsApp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
              >
                WhatsApp Enquiry
              </a>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-primary transition hover:border-accent dark:text-foreground"
            >
              Contact Us
            </Link>
          </div>
        </div>
      ) : view === "subcategories" && activeCategory ? (
        <>
          <p className="mb-6 text-sm text-muted">
            Select a sub-category under <strong>{activeCategory.name}</strong>.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getSubCategoriesByCategory(activeCategory.slug).map((sub) => (
              <li key={sub.slug}>
                <button
                  type="button"
                  onClick={() => navigate({ category: activeCategory.slug, sub: sub.slug })}
                  className="group flex h-full w-full items-center justify-between rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-accent hover:shadow-md"
                >
                  <span className="font-display text-base font-semibold text-primary group-hover:text-accent dark:text-foreground">
                    {sub.name}
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-accent opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <PackageOpen className="mb-4 h-14 w-14 text-muted/50" />
          <h2 className="font-display text-lg font-semibold text-primary dark:text-foreground">
            No products found
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Try another sub-category or clear your search to browse the catalogue.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              navigate({ category: categoryParam || undefined });
            }}
            className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-primary"
          >
            Back to categories
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
