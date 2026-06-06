import { toTitleCase } from "@/lib/title-case";

export interface Category {
  name: string;
  slug: string;
  /** Basename in /public/images/categories/ (e.g. Category-1) — extension resolved at runtime */
  imageFile: string;
  description: string;
}

export const BRAND_TAGLINE =
  "AEC — Manufacturer & Supplier of Lifting Solutions, Rigging Accessories, Material Handling Equipment & Scaffolding/Mivan Shuttering Items";

export const CATEGORY_IMAGE_PLACEHOLDER = "/images/categories/category-placeholder.svg";

export const CATEGORY_IMAGE_EXTENSIONS = [".png", ".jpg", ".webp"] as const;

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
    slug: "scaffolding-mivan-shuttering",
    description:
      "complete range of scaffolding systems and mivan shuttering solutions for construction projects",
  },
];

export const CATEGORIES: Category[] = categoryData.map((c) => ({
  ...c,
  imageFile: CATEGORY_IMAGE_FILES[c.slug] ?? "Category-1",
  description: toTitleCase(c.description),
}));

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
