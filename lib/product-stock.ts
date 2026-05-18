/** Keep quantity and inStock in sync for admin + storefront visibility. */
export function normalizeStockFields(
  input: { quantity?: number; inStock?: boolean },
  current?: { quantity: number; inStock: boolean }
): { quantity: number; inStock: boolean } {
  let quantity =
    input.quantity !== undefined
      ? Math.max(0, Math.floor(Number(input.quantity)))
      : (current?.quantity ?? 0);
  let inStock =
    input.inStock !== undefined ? Boolean(input.inStock) : (current?.inStock ?? true);

  if (input.inStock === false) {
    quantity = 0;
    inStock = false;
  } else if (input.quantity !== undefined && quantity === 0) {
    inStock = false;
  } else if (input.inStock === true && quantity === 0) {
    quantity = 1;
    inStock = true;
  } else if (input.quantity !== undefined && quantity > 0) {
    inStock = true;
  }

  return { quantity, inStock };
}

/** MongoDB filter: only sellable products on the public site. */
export const PUBLIC_PRODUCT_FILTER = {
  inStock: true,
  quantity: { $gt: 0 },
};
