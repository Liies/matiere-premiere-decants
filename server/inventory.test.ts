import { describe, expect, it } from "vitest";
import { consolidateOrderLines, requiredMilliliters } from "../shared/inventory";

describe("réservation de stock", () => {
  it("fusionne les lignes de variante avant de réserver les millilitres", () => {
    expect(consolidateOrderLines([
      { productId: 10, variantId: 101, quantity: 1 },
      { productId: 10, variantId: 101, quantity: 2 },
      { productId: 10, variantId: 102, quantity: 1 },
    ])).toEqual([
      { productId: 10, variantId: 101, quantity: 3 },
      { productId: 10, variantId: 102, quantity: 1 },
    ]);
  });

  it("calcule le volume à réserver à partir du format et de la quantité", () => {
    expect(requiredMilliliters(5, 3)).toBe(15);
  });
});
