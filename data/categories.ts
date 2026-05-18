export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "Material Handling",
    slug: "material-handling",
    icon: "🏗️",
    description: "Cranes, hoists, trolleys & lifting machinery",
  },
  {
    name: "Lifting Equipment",
    slug: "lifting-equipment",
    icon: "⚙️",
    description: "Hooks, shackles, wire ropes & rigging gear",
  },
  {
    name: "Scaffolding Items",
    slug: "scaffolding",
    icon: "🪜",
    description: "Scaffolding systems & accessories",
  },
  {
    name: "Construction Safety",
    slug: "construction-safety",
    icon: "🛡️",
    description: "Site safety equipment & barriers",
  },
  {
    name: "Personal Protective Eq.",
    slug: "ppe",
    icon: "🦺",
    description: "Helmets, gloves, belts & protective gear",
  },
  {
    name: "Welding Equipment",
    slug: "welding",
    icon: "🔥",
    description: "Welding machines & accessories",
  },
  {
    name: "Engineering Tools",
    slug: "engineering-tools",
    icon: "🔧",
    description: "Precision tools for engineering work",
  },
  {
    name: "PVC Equipment",
    slug: "pvc",
    icon: "📦",
    description: "PVC pipes, fittings & equipment",
  },
  {
    name: "Cable Management",
    slug: "cable-management",
    icon: "🔌",
    description: "Cable trays, ties & management systems",
  },
  {
    name: "Safety Net & Ropes",
    slug: "safety-nets",
    icon: "🪢",
    description: "Safety nets, ropes & lashing equipment",
  },
  {
    name: "Stainless Steel Equipment",
    slug: "stainless-steel",
    icon: "✨",
    description: "Premium stainless steel products",
  },
  {
    name: "AEC Exclusive",
    slug: "aec-exclusive",
    icon: "⭐",
    description: "Exclusive Alamdaar Engineering products",
  },
];
