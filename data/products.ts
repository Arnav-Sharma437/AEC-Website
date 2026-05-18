import { CATEGORIES } from "./categories";

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

function createProduct(
  name: string,
  categorySlug: string,
  featured = false
): Product {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const categoryName = category?.name ?? categorySlug;
  return {
    id: `${categorySlug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    category: categoryName,
    categorySlug,
    description: `High-quality ${name.toLowerCase()} from Alamdaar Engineering Concern. Built for industrial durability and certified performance.`,
    image: `/images/products/${categorySlug}/placeholder.jpg`,
    price: "XXX",
    featured,
  };
}

const materialHandlingNames = [
  "Engine Crane", "Mini Crane Set", "Hand Stacker", "Drum Stacker",
  "Drum Mover", "Platform Trolley", "Pallet Truck", "Scissor Table",
  "Electric Winch", "CD1 Hoist", "KCD Hoist", "Mini Hoist",
  "Crane Scale", "Chain Hoist", "DHS Chain Hoist", "Wire Rope Winch",
  "Ratchet Lever", "Chain Pulley Block", "Push Pull Trolley",
  "Geared Trolley", "Electric Trolley", "Cargo Trolley", "Hydraulic Jack",
  "Screw Jack", "Ratchet Puller", "P&L Machine", "Beam Clamp",
  "Magnet Lifter", "Drum Lifter", "Trolley Jack", "Wire Rope Sling",
  "Chain Sling", "Horizontal Clamp", "Vertical Clamp",
  "Lashing Belt", "Webbing Sling", "Ratchet Belt", "Spring Balancer",
  "Hand Winch", "Boat Winch", "Crab Winch", "Block Lifting Clamp",
];

const liftingNames = [
  "Eye Hook", "Eye Self Locking Hook", "Eye Slip Hook", "Eye Foundry Hook",
  "Clevis Hook", "Clevis Self Locking Hook", "Clevis Slip Hook",
  "Eye Grab Hook", "Clevis Grab Hook", "Shank Hook",
  "Bow Shackle", "D-Shackle", "Nut Type Bow Shackle",
  "G.I Wire Rope", "Steel Wire Rope", "Turnbuckles",
  "Oblong Ring", "Round Ring", "D-Ring", "Masterlink Assembly",
  "Ferrules", "Safety Latch", "Morris Wheel", "Snatch Pulley",
];

const ppeNames = [
  "Safety Helmet", "Eye Glasses for Safety", "Anti-Fog Glasses", "Welding Glasses",
  "Eye Protector", "Ear Protector", "N95 Mask", "3 Ply Mask",
  "Industrial Nose Mask", "Venus Nose Mask", "Face Protector",
  "Safety Shoes", "Mallcom Safety Shoes", "Karam Safety Shoes",
  "Cotton Gloves", "Anti Cut Gloves", "Rubber Gloves",
  "Reflective Safety Jacket (Orange)", "Reflective Safety Jacket (Green)",
  "Full Body Belt", "Half Body Belt", "Karam Safety Belt", "Fall Arrester",
];

export const products: Product[] = [
  ...materialHandlingNames.map((name, i) =>
    createProduct(name, "material-handling", i < 4)
  ),
  ...liftingNames.map((name, i) =>
    createProduct(name, "lifting-equipment", i < 2)
  ),
  ...ppeNames.map((name, i) =>
    createProduct(name, "ppe", i < 2)
  ),
];

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
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
