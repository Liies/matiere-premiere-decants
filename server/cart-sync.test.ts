import { describe, expect, it } from "vitest";
import { buildCartSyncPlan, CartSyncValidationError } from "@shared/cart-sync";

const variants = [
  { id: 11, productId: 1, sizeMl: 2 },
  { id: 12, productId: 1, sizeMl: 50 },
  { id: 21, productId: 2, sizeMl: 2 },
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
      productVolumes: [
        { productId: 1, availableMl: 100 },
        { productId: 2, availableMl: 10 },
      ],
    });

    expect(plan).toEqual(expect.arrayContaining([
      { productId: 1, variantId: 11, quantity: 3 },
      { productId: 1, variantId: 12, quantity: 1 },
      { productId: 2, variantId: 21, quantity: 2 },
    ]));
  });

  it("refuse une fusion lorsque les formats cumulés dépassent le volume source", () => {
    expect(() => buildCartSyncPlan({
      accountItems: [{ productId: 1, variantId: 11, quantity: 24 }],
      guestItems: [{ productId: 1, variantId: 12, quantity: 1 }],
      variants,
      productVolumes: [{ productId: 1, availableMl: 50 }],
    })).toThrow(CartSyncValidationError);
  });

  it("refuse une variante supprimée, associée au mauvais parfum ou une quantité invalide", () => {
    expect(() => buildCartSyncPlan({
      accountItems: [],
      guestItems: [{ productId: 99, variantId: 11, quantity: 1 }],
      variants,
      productVolumes: [],
    })).toThrow("n’existe plus");

    expect(() => buildCartSyncPlan({
      accountItems: [],
      guestItems: [{ productId: 1, variantId: 11, quantity: 0 }],
      variants,
      productVolumes: [{ productId: 1, availableMl: 10 }],
    })).toThrow("quantité ou un format invalide");
  });
});
