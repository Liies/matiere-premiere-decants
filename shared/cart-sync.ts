export type CartVariantQuantity = {
  productId: number;
  variantId: number;
  quantity: number;
};

export type StockedVariant = {
  id: number;
  productId: number;
  sizeMl: number;
};

export type AvailableProductVolume = {
  productId: number;
  availableMl: number;
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
 * contenances et en vérifiant le volume total consommé par parfum.
 */
export function buildCartSyncPlan({
  accountItems,
  guestItems,
  variants,
  productVolumes,
}: {
  accountItems: CartVariantQuantity[];
  guestItems: CartVariantQuantity[];
  variants: StockedVariant[];
  productVolumes: AvailableProductVolume[];
}): CartVariantQuantity[] {
  const lines = toQuantityMap(accountItems);
  const guestLines = toQuantityMap(guestItems);
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]));
  const availableVolumeByProduct = new Map(productVolumes.map((volume) => [volume.productId, volume.availableMl]));

  for (const guestLine of Array.from(guestLines.values())) {
    const variant = variantsById.get(guestLine.variantId);
    if (!variant || variant.productId !== guestLine.productId) {
      throw new CartSyncValidationError(`Le format du produit ${guestLine.productId} n’existe plus`);
    }
    const accountLine = lines.get(guestLine.variantId);
    lines.set(guestLine.variantId, {
      productId: guestLine.productId,
      variantId: guestLine.variantId,
      quantity: (accountLine?.quantity ?? 0) + guestLine.quantity,
    });
  }

  const requestedMlByProduct = new Map<number, number>();
  for (const line of Array.from(lines.values())) {
    const variant = variantsById.get(line.variantId);
    if (!variant || variant.productId !== line.productId) {
      throw new CartSyncValidationError(`Le format du produit ${line.productId} n’existe plus`);
    }
    requestedMlByProduct.set(line.productId, (requestedMlByProduct.get(line.productId) ?? 0) + variant.sizeMl * line.quantity);
  }

  for (const [productId, requestedMl] of Array.from(requestedMlByProduct.entries())) {
    const availableMl = availableVolumeByProduct.get(productId);
    if (availableMl === undefined) {
      throw new CartSyncValidationError(`Le stock du produit ${productId} est indisponible`);
    }
    if (requestedMl > availableMl) {
      throw new CartSyncValidationError(`Stock insuffisant pour le produit ${productId}`);
    }
  }

  return Array.from(lines.values());
}
