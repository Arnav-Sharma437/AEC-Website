import { toTitleCase } from "@/lib/title-case";

export interface Category {
  name: string;
  slug: string;
  /** Basename in /public/images/categories/ (e.g. Category-1) — extension resolved at runtime */
  imageFile: string;
  description: string;
}

export const BRAND_TAGLINE =
  "AEC — Manufacturer & Supplier of Lifting, Rigging, Material Handling Equipment & Scaffolding/Mivan Shuttering Items";

export const CATEGORY_IMAGE_PLACEHOLDER = "/images/categories/category-placeholder.svg";

export const CATEGORY_IMAGE_EXTENSIONS = [".png", ".jpg", ".webp"] as const;

/** Upload Category-1 … Category-5 to /public/images/categories/ (png, jpg, or webp). */
const CATEGORY_IMAGE_FILES: Record<string, string> = {
  "lifting-hardware-rigging": "Category-1",
  "hoists-winches": "Category-2",
  "material-handling-equipment": "Category-3",
  "lashing-cargo-control": "Category-4",
  "wire-rope-lifting-accessories": "Category-5",
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
] as const;

const categoryData: {
  name: string;
  slug: string;
  description: string;
}[] = [
  {
    name: "Lifting Hardware & Rigging",
    slug: "lifting-hardware-rigging",
    description:
      "shackles, eye bolts, turnbuckles, hooks, and rigging hardware for safe lifting",
  },
  {
    name: "Hoists & Winches",
    slug: "hoists-winches",
    description:
      "electric and manual hoists, winches, trolleys, and hoist spare parts",
  },
  {
    name: "Material Handling Equipment",
    slug: "material-handling-equipment",
    description:
      "pallet trucks, stackers, drum handling, and platform trolleys",
  },
  {
    name: "Lashing & Cargo Control",
    slug: "lashing-cargo-control",
    description:
      "ratchet lashings, web slings, round slings, and cargo securing gear",
  },
  {
    name: "Wire Rope & Lifting Accessories",
    slug: "wire-rope-lifting-accessories",
    description:
      "wire rope, slings, master links, and connecting links",
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
