import type { Product } from "@/data/products";
import { products as staticProducts } from "@/data/products";

export const PRODUCT_PLACEHOLDER = "/images/product-placeholder.svg";

/** Use Cloudinary/CDN URL when present; otherwise show site placeholder. */
export function resolveProductImage(image?: string | null): string {
  const url = (image || "").trim();
  if (!url) return PRODUCT_PLACEHOLDER;
  if (url.includes("cloudinary.com") || url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }
  if (url.includes("placeholder")) return PRODUCT_PLACEHOLDER;
  return url.startsWith("/") ? url : PRODUCT_PLACEHOLDER;
}

export function mapApiProduct(p: Record<string, unknown>): Product {
  const rawImage = p.image as string | undefined;
  return {
    id: String(p._id ?? p.slug ?? p.id ?? ""),
    name: String(p.name ?? ""),
    category: String(p.categoryName ?? p.category ?? ""),
    categorySlug: String(p.category ?? ""),
    description: String(p.description ?? ""),
    image: resolveProductImage(rawImage),
    price: String(p.price ?? "XXX"),
    featured: Boolean(p.featured),
  };
}

export async function fetchPublicProducts(
  query?: Record<string, string>
): Promise<Product[]> {
  const params = new URLSearchParams(query);
  const qs = params.toString();
  const res = await fetch(`/api/products${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((p) => mapApiProduct(p as Record<string, unknown>));
}

export function getStaticProductsFallback(): Product[] {
  return staticProducts.map((p) => ({
    ...p,
    image: resolveProductImage(p.image),
  }));
}
