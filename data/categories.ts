export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export const BRAND_TAGLINE =
  "AEC — Manufacturer & Supplier of Lifting, Rigging and Material Handling Equipment";

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

export const CATEGORIES: Category[] = [
  {
    name: "Lifting Hardware & Rigging",
    slug: "lifting-hardware-rigging",
    icon: "🔗",
    description:
      "Shackles, eye bolts, turnbuckles, hooks, and rigging hardware for safe lifting.",
  },
  {
    name: "Hoists & Winches",
    slug: "hoists-winches",
    icon: "⚙️",
    description:
      "Electric and manual hoists, winches, trolleys, and hoist spare parts.",
  },
  {
    name: "Material Handling Equipment",
    slug: "material-handling-equipment",
    icon: "🏗️",
    description:
      "Pallet trucks, stackers, drum handling, and platform trolleys.",
  },
  {
    name: "Lashing & Cargo Control",
    slug: "lashing-cargo-control",
    icon: "⚓",
    description:
      "Ratchet lashings, web slings, round slings, and cargo securing gear.",
  },
  {
    name: "Wire Rope & Lifting Accessories",
    slug: "wire-rope-lifting-accessories",
    icon: "🪢",
    description:
      "Wire rope, slings, master links, and connecting links.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
