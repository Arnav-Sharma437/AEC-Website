import { CATEGORIES } from "./categories";
import { FEATURED_PRODUCT_IDS } from "./featured";
import { toTitleCase } from "@/lib/title-case";

export const PRODUCT_PLACEHOLDER = "/images/product-placeholder.svg";

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  image: string;
  price: string;
  featured: boolean;
}

const featuredSet = new Set<string>(FEATURED_PRODUCT_IDS);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createProduct(
  name: string,
  categorySlug: string,
  featured?: boolean
): Product {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const categoryName = category?.name ?? categorySlug;
  const id = `${categorySlug}-${slugify(name)}`;
  const isFeatured = featured ?? featuredSet.has(id);

  return {
    id,
    name,
    category: categoryName,
    categorySlug,
    description: toTitleCase(
      `${name} — premium industrial equipment from alamdaar engineering concern (aec), howrah`
    ),
    image: PRODUCT_PLACEHOLDER,
    price: "XXX",
    featured: isFeatured,
  };
}

type CatalogItem = { name: string; categorySlug: string };

const catalog: CatalogItem[] = [
  // Lifting Solutions
  { name: "Manual Chain Pulley Block", categorySlug: "lifting-solutions" },
  { name: "Electric Chain Hoist", categorySlug: "lifting-solutions" },
  { name: "Electric Wire Rope Hoist", categorySlug: "lifting-solutions" },
  { name: "Ratchet Lever Hoist", categorySlug: "lifting-solutions" },
  { name: "Pulling & Lifting Machine (Tirfor)", categorySlug: "lifting-solutions" },
  { name: "Electric Winch", categorySlug: "lifting-solutions" },
  { name: "Trolley", categorySlug: "lifting-solutions" },
  { name: "Crane", categorySlug: "lifting-solutions" },
  { name: "Pulley", categorySlug: "lifting-solutions" },
  // Rigging & Lifting Accessories
  { name: "Chains", categorySlug: "rigging-lifting-accessories" },
  { name: "Webbing Sling", categorySlug: "rigging-lifting-accessories" },
  { name: "Lifting Clamp", categorySlug: "rigging-lifting-accessories" },
  { name: "Shackles", categorySlug: "rigging-lifting-accessories" },
  { name: "Rigging Hardware", categorySlug: "rigging-lifting-accessories" },
  // Material Handling Equipment
  { name: "Hydraulic Pallet Truck", categorySlug: "material-handling-equipment" },
  { name: "Manual Stacker", categorySlug: "material-handling-equipment" },
  { name: "Semi-Electric Stacker", categorySlug: "material-handling-equipment" },
  { name: "Electric Stacker", categorySlug: "material-handling-equipment" },
  { name: "Hand Pallet Truck", categorySlug: "material-handling-equipment" },
  { name: "Material Handling Equipment", categorySlug: "material-handling-equipment" },
];

export const products: Product[] = catalog.map((item) =>
  createProduct(item.name, item.categorySlug)
);

export const PRODUCT_COUNT = products.length;

export const VALID_CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
export const VALID_PRODUCT_SLUGS = products.map((p) => p.id);

export function getFeaturedProducts() {
  const order = FEATURED_PRODUCT_IDS as readonly string[];
  return order
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export function getProductsByCategory(slug?: string) {
  if (!slug) return products;
  return products.filter((p) => p.categorySlug === slug);
}

export function searchProducts(query: string) {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
