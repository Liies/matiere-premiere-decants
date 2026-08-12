export type CartQuantity = {
  productId: number;
  quantity: number;
};

export type StockedProduct = {
  id: number;
  stock: number;
};

export class CartSyncValidationError extends Error {}

function toQuantityMap(items: CartQuantity[]) {
  return items.reduce<Map<number, number>>((quantities, item) => {
    if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new CartSyncValidationError("Le panier invité contient une quantité invalide");
    }
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    return quantities;
  }, new Map());
}

export function buildCartSyncPlan({
  accountItems,
  guestItems,
  products,
}: {
  accountItems: CartQuantity[];
  guestItems: CartQuantity[];
  products: StockedProduct[];
}): CartQuantity[] {
  const quantities = toQuantityMap(accountItems);
  const guestQuantities = toQuantityMap(guestItems);
  const productsById = new Map(products.map((product) => [product.id, product]));

  Array.from(guestQuantities.entries()).forEach(([productId, guestQuantity]) => {
    const product = productsById.get(productId);
    if (!product) {
      throw new CartSyncValidationError(`Le produit ${productId} n’existe plus`);
    }

    const nextQuantity = (quantities.get(productId) ?? 0) + guestQuantity;
    if (product.stock < nextQuantity) {
      throw new CartSyncValidationError(`Stock insuffisant pour le produit ${productId}`);
    }
    quantities.set(productId, nextQuantity);
  });

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}
