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
      `${name} — premium lifting, rigging and material handling equipment from alamdaar engineering concern (aec), howrah`
    ),
    image: PRODUCT_PLACEHOLDER,
    price: "XXX",
    featured: isFeatured,
  };
}

type CatalogItem = { name: string; categorySlug: string };

const catalog: CatalogItem[] = [
  // Lifting Hardware & Rigging
  { name: "D Shackle Screw Pin", categorySlug: "lifting-hardware-rigging" },
  { name: "D Shackle Nut Bolt", categorySlug: "lifting-hardware-rigging" },
  { name: "Bow Shackle Screw Pin", categorySlug: "lifting-hardware-rigging" },
  { name: "Bow Shackle Nut Bolt", categorySlug: "lifting-hardware-rigging" },
  { name: "Eye Bolt", categorySlug: "lifting-hardware-rigging" },
  { name: "Eye Nut", categorySlug: "lifting-hardware-rigging" },
  { name: "Turnbuckle", categorySlug: "lifting-hardware-rigging" },
  { name: "Wire Rope Clip", categorySlug: "lifting-hardware-rigging" },
  { name: "Thimble", categorySlug: "lifting-hardware-rigging" },
  { name: "Ferrule", categorySlug: "lifting-hardware-rigging" },
  { name: "Hook", categorySlug: "lifting-hardware-rigging" },
  { name: "Swivel", categorySlug: "lifting-hardware-rigging" },
  { name: "Chain Accessories", categorySlug: "lifting-hardware-rigging" },
  // Hoists & Winches
  { name: "Electric Wire Rope Hoist", categorySlug: "hoists-winches" },
  { name: "Chain Hoist", categorySlug: "hoists-winches" },
  { name: "Electric Chain Hoist", categorySlug: "hoists-winches" },
  { name: "Mini Electric Hoist", categorySlug: "hoists-winches" },
  { name: "Electric Winch", categorySlug: "hoists-winches" },
  { name: "Manual Winch", categorySlug: "hoists-winches" },
  { name: "Trolley", categorySlug: "hoists-winches" },
  { name: "Hoist Spare Parts", categorySlug: "hoists-winches" },
  // Material Handling Equipment
  { name: "Hand Pallet Truck", categorySlug: "material-handling-equipment" },
  { name: "Hydraulic Hand Stacker", categorySlug: "material-handling-equipment" },
  { name: "Semi-Electric Stacker", categorySlug: "material-handling-equipment" },
  { name: "Fully Electric Stacker", categorySlug: "material-handling-equipment" },
  { name: "Electric Pallet Truck", categorySlug: "material-handling-equipment" },
  { name: "Drum Handling Equipment", categorySlug: "material-handling-equipment" },
  { name: "Platform Trolley", categorySlug: "material-handling-equipment" },
  // Lashing & Cargo Control
  { name: "Ratchet Lashing Belt", categorySlug: "lashing-cargo-control" },
  { name: "Web Sling", categorySlug: "lashing-cargo-control" },
  { name: "Round Sling", categorySlug: "lashing-cargo-control" },
  { name: "Cargo Lashing", categorySlug: "lashing-cargo-control" },
  { name: "Chain Sling", categorySlug: "lashing-cargo-control" },
  // Wire Rope & Lifting Accessories
  { name: "Wire Rope", categorySlug: "wire-rope-lifting-accessories" },
  { name: "Wire Rope Sling", categorySlug: "wire-rope-lifting-accessories" },
  { name: "Master Link", categorySlug: "wire-rope-lifting-accessories" },
  { name: "Connecting Link", categorySlug: "wire-rope-lifting-accessories" },
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
