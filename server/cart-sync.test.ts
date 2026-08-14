import { describe, expect, it } from "vitest";
import { buildCartSyncPlan, CartSyncValidationError } from "@shared/cart-sync";

const variants = [
  { id: 11, productId: 1, stock: 3, isActive: true },
  { id: 12, productId: 1, stock: 1, isActive: true },
  { id: 21, productId: 2, stock: 2, isActive: true },
];

describe("buildCartSyncPlan", () => {
  it("fusionne une même variante sans mélanger deux contenances du même parfum", () => {
    const plan = buildCartSyncPlan({
      accountItems: [{ productId: 1, variantId: 11, quantity: 2 }],
      guestItems: [
        { productId: 1, variantId: 11, quantity: 1 },
        { productId: 1, variantId: 12, quantity: 1 },
        { productId: 2, variantId: 21, quantity: 2 },
      ],
      variants,
    });

    expect(plan).toEqual(expect.arrayContaining([
      { productId: 1, variantId: 11, quantity: 3 },
      { productId: 1, variantId: 12, quantity: 1 },
      { productId: 2, variantId: 21, quantity: 2 },
    ]));
  });

  it("refuse une fusion lorsqu’une variante dépasse son propre stock", () => {
    expect(() => buildCartSyncPlan({
      accountItems: [{ productId: 1, variantId: 11, quantity: 3 }],
      guestItems: [{ productId: 1, variantId: 11, quantity: 1 }],
      variants,
    })).toThrow(CartSyncValidationError);
  });

  it("refuse une variante supprimée, associée au mauvais parfum ou une quantité invalide", () => {
    expect(() => buildCartSyncPlan({
      accountItems: [],
      guestItems: [{ productId: 99, variantId: 11, quantity: 1 }],
      variants,
    })).toThrow("n’existe plus");

    expect(() => buildCartSyncPlan({
      accountItems: [],
      guestItems: [{ productId: 1, variantId: 11, quantity: 0 }],
      variants,
    })).toThrow("quantité ou un format invalide");
  });
});
