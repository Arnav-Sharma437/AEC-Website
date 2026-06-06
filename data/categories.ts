import { toTitleCase } from "@/lib/title-case";

export interface Category {
  name: string;
  slug: string;
  /** Basename in /public/images/categories/ (e.g. Category-1) — extension resolved at runtime */
  imageFile: string;
  description: string;
}

export interface SubCategory {
  name: string;
  slug: string;
  categorySlug: string;
}

export const BRAND_TAGLINE =
  "AEC — Manufacturer & Supplier of Lifting Solutions, Rigging Accessories, Material Handling Equipment & Scaffolding/Mivan Shuttering Items";

export const CATEGORY_IMAGE_PLACEHOLDER = "/images/categories/category-placeholder.svg";

export const CATEGORY_IMAGE_EXTENSIONS = [".png", ".jpg", ".webp"] as const;

export const ENQUIRY_ONLY_CATEGORY_SLUG = "scaffolding-mivan-shuttering";

/** Upload Category-1 … Category-4 to /public/images/categories/ (png, jpg, or webp). */
const CATEGORY_IMAGE_FILES: Record<string, string> = {
  "lifting-solutions": "Category-1",
  "rigging-lifting-accessories": "Category-2",
  "material-handling-equipment": "Category-3",
  "scaffolding-mivan-shuttering": "Category-4",
};

/** Legacy category slugs removed from catalogue (used by sync purge). */
export const REMOVED_CATEGORY_SLUGS = [
  "ppe",
  "engineering-tools",
  "welding",
  "cable-management",
  "pvc",
  "safety-nets",
  "scaffolding",
  "construction-safety",
  "stainless-steel",
  "aec-exclusive",
  "lifting-equipment",
  "material-handling",
  "lifting-hardware-rigging",
  "hoists-winches",
  "lashing-cargo-control",
  "wire-rope-lifting-accessories",
] as const;

const categoryData: {
  name: string;
  slug: string;
  description: string;
}[] = [
  {
    name: "Lifting Solutions",
    slug: "lifting-solutions",
    description:
      "manual and electric hoists, winches, trolleys, cranes, and pulleys for safe lifting operations",
  },
  {
    name: "Rigging & Lifting Accessories",
    slug: "rigging-lifting-accessories",
    description:
      "chains, webbing slings, lifting clamps, shackles, and rigging hardware for secure loads",
  },
  {
    name: "Material Handling Equipment",
    slug: "material-handling-equipment",
    description:
      "hydraulic pallet trucks, manual and electric stackers, and material handling solutions",
  },
  {
    name: "Scaffolding & Mivan Shuttering Items",
    slug: ENQUIRY_ONLY_CATEGORY_SLUG,
    description:
      "complete range of scaffolding systems and mivan shuttering solutions for construction projects",
  },
];

export function slugifyCatalogName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const subCategoryData: { name: string; categorySlug: string }[] = [
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
];

export const CATEGORIES: Category[] = categoryData.map((c) => ({
  ...c,
  imageFile: CATEGORY_IMAGE_FILES[c.slug] ?? "Category-1",
  description: toTitleCase(c.description),
}));

export const SUB_CATEGORIES: SubCategory[] = subCategoryData.map((s) => ({
  ...s,
  slug: slugifyCatalogName(s.name),
}));

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubCategoriesByCategory(categorySlug: string): SubCategory[] {
  return SUB_CATEGORIES.filter((s) => s.categorySlug === categorySlug);
}

export function getSubCategoryBySlug(
  categorySlug: string,
  subCategorySlug: string
): SubCategory | undefined {
  return SUB_CATEGORIES.find(
    (s) => s.categorySlug === categorySlug && s.slug === subCategorySlug
  );
}

export function isEnquiryOnlyCategory(slug: string): boolean {
  return slug === ENQUIRY_ONLY_CATEGORY_SLUG;
}
