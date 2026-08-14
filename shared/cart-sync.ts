export type CartVariantQuantity = {
  productId: number;
  variantId: number;
  quantity: number;
};

export type StockedVariant = {
  id: number;
  productId: number;
  stock: number;
  isActive: boolean;
};

export class CartSyncValidationError extends Error {}

function toQuantityMap(items: CartVariantQuantity[]) {
  return items.reduce<Map<number, CartVariantQuantity>>((lines, item) => {
    if (!Number.isInteger(item.productId) || !Number.isInteger(item.variantId) || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new CartSyncValidationError("Le panier invité contient une quantité ou un format invalide");
    }
    const current = lines.get(item.variantId);
    if (current && current.productId !== item.productId) {
      throw new CartSyncValidationError("Une variante ne peut pas appartenir à deux parfums");
    }
    lines.set(item.variantId, { productId: item.productId, variantId: item.variantId, quantity: (current?.quantity ?? 0) + item.quantity });
    return lines;
  }, new Map());
}

/**
 * Fusionne un panier invité avec un panier de compte, sans jamais mélanger deux
 * contenances et en vérifiant le stock propre à chaque variante.
 */
export function buildCartSyncPlan({
  accountItems,
  guestItems,
  variants,
}: {
  accountItems: CartVariantQuantity[];
  guestItems: CartVariantQuantity[];
  variants: StockedVariant[];
}): CartVariantQuantity[] {
  const lines = toQuantityMap(accountItems);
  const guestLines = toQuantityMap(guestItems);
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]));

  for (const guestLine of Array.from(guestLines.values())) {
    const variant = variantsById.get(guestLine.variantId);
    if (!variant || !variant.isActive || variant.productId !== guestLine.productId) {
      throw new CartSyncValidationError(`Le format du produit ${guestLine.productId} n’existe plus`);
    }
    const accountLine = lines.get(guestLine.variantId);
    lines.set(guestLine.variantId, {
      productId: guestLine.productId,
      variantId: guestLine.variantId,
      quantity: (accountLine?.quantity ?? 0) + guestLine.quantity,
    });
  }

  for (const line of Array.from(lines.values())) {
    const variant = variantsById.get(line.variantId);
    if (!variant || !variant.isActive || variant.productId !== line.productId) {
      throw new CartSyncValidationError(`Le format du produit ${line.productId} n’existe plus`);
    }
    if (line.quantity > variant.stock) {
      throw new CartSyncValidationError(`Stock insuffisant pour le format du produit ${line.productId}`);
    }
  }

  return Array.from(lines.values());
}
