import {
  CATEGORIES,
  SUB_CATEGORIES,
  slugifyCatalogName,
  type SubCategory,
} from "./categories";
import { FEATURED_PRODUCT_IDS } from "./featured";
import { toTitleCase } from "@/lib/title-case";

export const PRODUCT_PLACEHOLDER = "/images/product-placeholder.svg";

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  subCategory: string;
  subCategorySlug: string;
  description: string;
  image: string;
  price: string;
  featured: boolean;
}

const featuredSet = new Set<string>(FEATURED_PRODUCT_IDS);

function createProduct(
  name: string,
  categorySlug: string,
  subCategorySlug: string,
  subCategoryName: string,
  featured?: boolean
): Product {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const categoryName = category?.name ?? categorySlug;
  const id = `${categorySlug}-${subCategorySlug}-${slugifyCatalogName(name)}`;
  const isFeatured = featured ?? featuredSet.has(id);

  return {
    id,
    name,
    category: categoryName,
    categorySlug,
    subCategory: subCategoryName,
    subCategorySlug,
    description: toTitleCase(
      `${name} — premium industrial equipment from alamdaar engineering concern (aec), howrah`
    ),
    image: PRODUCT_PLACEHOLDER,
    price: "XXX",
    featured: isFeatured,
  };
}

/** Default catalogue: one primary product line per sub-category. */
function buildDefaultCatalog(): Product[] {
  return SUB_CATEGORIES.map((sub: SubCategory) =>
    createProduct(sub.name, sub.categorySlug, sub.slug, sub.name)
  );
}

export const products: Product[] = buildDefaultCatalog();

export const PRODUCT_COUNT = products.length;

export const VALID_CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
export const VALID_SUB_CATEGORY_SLUGS = SUB_CATEGORIES.map((s) => s.slug);
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

export function getProductsBySubCategory(categorySlug: string, subCategorySlug: string) {
  return products.filter(
    (p) => p.categorySlug === categorySlug && p.subCategorySlug === subCategorySlug
  );
}

export function searchProducts(query: string) {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
