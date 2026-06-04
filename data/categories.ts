import { toTitleCase } from "@/lib/title-case";

export interface Category {
  name: string;
  slug: string;
  image: string;
  description: string;
}

export const BRAND_TAGLINE =
  "AEC — Manufacturer & Supplier of Lifting, Rigging, Material Handling Equipment & Scaffolding/Mivan Shuttering Items";

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
  image: string;
  description: string;
}[] = [
  {
    name: "Lifting Hardware & Rigging",
    slug: "lifting-hardware-rigging",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format&fit=crop",
    description:
      "shackles, eye bolts, turnbuckles, hooks, and rigging hardware for safe lifting",
  },
  {
    name: "Hoists & Winches",
    slug: "hoists-winches",
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80&auto=format&fit=crop",
    description:
      "electric and manual hoists, winches, trolleys, and hoist spare parts",
  },
  {
    name: "Material Handling Equipment",
    slug: "material-handling-equipment",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd90c95d2?w=800&q=80&auto=format&fit=crop",
    description:
      "pallet trucks, stackers, drum handling, and platform trolleys",
  },
  {
    name: "Lashing & Cargo Control",
    slug: "lashing-cargo-control",
    image:
      "https://images.unsplash.com/photo-1494412575833-205611f074ad?w=800&q=80&auto=format&fit=crop",
    description:
      "ratchet lashings, web slings, round slings, and cargo securing gear",
  },
  {
    name: "Wire Rope & Lifting Accessories",
    slug: "wire-rope-lifting-accessories",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80&auto=format&fit=crop",
    description:
      "wire rope, slings, master links, and connecting links",
  },
];

export const CATEGORIES: Category[] = categoryData.map((c) => ({
  ...c,
  description: toTitleCase(c.description),
}));

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
