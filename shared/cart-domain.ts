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

export function getProductQuantityInCart(lines: readonly CartQuantityLine[], productId: number) {
  return lines
    .filter((line) => line.productId === productId)
    .reduce((total, line) => total + line.quantity, 0);
}

export function getVariantQuantityInCart(lines: readonly CartQuantityLine[], variantId: number) {
  return lines
    .filter((line) => line.variantId === variantId)
    .reduce((total, line) => total + line.quantity, 0);
}

/** Retourne le volume total demandé pour un parfum à partir de ses formats présents au panier. */
export function getProductVolumeInCart(
  lines: readonly (CartQuantityLine & { id?: number })[],
  variants: readonly { id: number; productId: number; sizeMl: number }[],
  productId: number,
  quantityOverride?: { cartItemId: number; quantity: number },
) {
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]));
  return lines
    .filter((line) => line.productId === productId && line.variantId)
    .reduce((total, line) => {
      const variant = variantsById.get(line.variantId!);
      if (!variant || variant.productId !== productId) return total;
      const quantity = quantityOverride && line.id === quantityOverride.cartItemId
        ? quantityOverride.quantity
        : line.quantity;
      return total + variant.sizeMl * quantity;
    }, 0);
}

export function hasSufficientStock(availableQuantity: number, requestedQuantity: number) {
  return availableQuantity >= requestedQuantity;
}

export function canAddToCart(availableQuantity: number, quantityAlreadyInCart: number, requestedQuantity: number) {
  return hasSufficientStock(availableQuantity, quantityAlreadyInCart + requestedQuantity);
}
