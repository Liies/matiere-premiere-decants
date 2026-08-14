export type RequestedOrderLine = {
  productId?: number;
  quantity: number;
  variantId: number;
};

export type ConsolidatedOrderLine = {
  quantity: number;
  variantId: number;
};

/** Fusionne les lignes identiques avant toute validation ou décrément de stock. */
export function consolidateOrderLines(lines: RequestedOrderLine[]): ConsolidatedOrderLine[] {
  const byKey = new Map<string, ConsolidatedOrderLine>();

  for (const line of lines) {
    const existing = byKey.get(String(line.variantId));
    if (existing) {
      existing.quantity += line.quantity;
    } else {
      byKey.set(String(line.variantId), { variantId: line.variantId, quantity: line.quantity });
    }
  }

  return Array.from(byKey.values());
}
