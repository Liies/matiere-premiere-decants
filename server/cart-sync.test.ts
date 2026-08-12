import { describe, expect, it } from "vitest";
import { buildCartSyncPlan, CartSyncValidationError } from "@shared/cart-sync";

describe("buildCartSyncPlan", () => {
  it("fusionne les quantités du panier compte et du panier invité", () => {
    const plan = buildCartSyncPlan({
      accountItems: [{ productId: 1, quantity: 2 }],
      guestItems: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ],
      products: [
        { id: 1, stock: 5 },
        { id: 2, stock: 3 },
      ],
    });

    expect(plan).toEqual([
      { productId: 1, quantity: 3 },
      { productId: 2, quantity: 2 },
    ]);
  });

  it("agrège les doublons transmis par un ancien panier invité", () => {
    const plan = buildCartSyncPlan({
      accountItems: [],
      guestItems: [
        { productId: 3, quantity: 1 },
        { productId: 3, quantity: 2 },
      ],
      products: [{ id: 3, stock: 4 }],
    });

    expect(plan).toEqual([{ productId: 3, quantity: 3 }]);
  });

  it("refuse la fusion entière si la quantité fusionnée dépasse le stock", () => {
    expect(() => buildCartSyncPlan({
      accountItems: [{ productId: 4, quantity: 2 }],
      guestItems: [{ productId: 4, quantity: 2 }],
      products: [{ id: 4, stock: 3 }],
    })).toThrow(CartSyncValidationError);
  });

  it("refuse les produits supprimés et les quantités malformées", () => {
    expect(() => buildCartSyncPlan({
      accountItems: [],
      guestItems: [{ productId: 99, quantity: 1 }],
      products: [],
    })).toThrow("n’existe plus");

    expect(() => buildCartSyncPlan({
      accountItems: [],
      guestItems: [{ productId: 1, quantity: 0 }],
      products: [{ id: 1, stock: 10 }],
    })).toThrow("quantité invalide");
  });
});
