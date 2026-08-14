/**
 * Règles de domaine du panier.
 *
 * Ces fonctions sont volontairement pures : elles ne connaissent ni la base
 * de données, ni tRPC, ni l’interface. Elles peuvent donc être testées et
 * réutilisées sans infrastructure.
 */
export type CartQuantityLine = {
  productId: number;
  quantity: number;
  variantId?: number | null;
};

export function getVariantQuantityInCart(lines: readonly CartQuantityLine[], variantId: number) {
  return lines
    .filter((line) => line.variantId === variantId)
    .reduce((total, line) => total + line.quantity, 0);
}

export function hasSufficientStock(availableQuantity: number, requestedQuantity: number) {
  return availableQuantity >= requestedQuantity;
}

export function canAddToCart(availableQuantity: number, quantityAlreadyInCart: number, requestedQuantity: number) {
  return hasSufficientStock(availableQuantity, quantityAlreadyInCart + requestedQuantity);
}
