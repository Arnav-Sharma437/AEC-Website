/** Homepage featured section — fixed order (8 core products). */
export const FEATURED_PRODUCT_IDS = [
  "lifting-solutions-electric-chain-hoist-electric-chain-hoist",
  "lifting-solutions-electric-wire-rope-hoist-electric-wire-rope-hoist",
  "lifting-solutions-electric-winch-electric-winch",
  "lifting-solutions-crane-crane",
  "material-handling-equipment-hand-pallet-truck-hand-pallet-truck",
  "material-handling-equipment-electric-stacker-electric-stacker",
  "rigging-lifting-accessories-shackles-shackles",
  "rigging-lifting-accessories-webbing-sling-webbing-sling",
] as const;

export const FEATURED_CAROUSEL_1_IDS = FEATURED_PRODUCT_IDS.slice(0, 4);
export const FEATURED_CAROUSEL_2_IDS = FEATURED_PRODUCT_IDS.slice(4, 8);
