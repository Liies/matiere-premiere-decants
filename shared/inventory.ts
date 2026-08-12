export type RequestedOrderLine = {
  productId: number;
  quantity: number;
  variantId?: number | null;
};

export type ConsolidatedOrderLine = {
  productId: number;
  quantity: number;
  variantId?: number;
};

/** Fusionne les lignes identiques avant toute validation ou décrément de stock. */
export function consolidateOrderLines(lines: RequestedOrderLine[]): ConsolidatedOrderLine[] {
  const byKey = new Map<string, ConsolidatedOrderLine>();

  for (const line of lines) {
    const variantId = line.variantId ?? undefined;
    const key = variantId ? `variant:${variantId}` : `legacy:${line.productId}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.quantity += line.quantity;
    } else {
      byKey.set(key, { productId: line.productId, quantity: line.quantity, ...(variantId ? { variantId } : {}) });
    }
  }

  return Array.from(byKey.values());
}

export function requiredMilliliters(sizeMl: number, quantity: number): number {
  return sizeMl * quantity;
}
