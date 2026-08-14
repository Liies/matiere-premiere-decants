import { describe, expect, it } from "vitest";
import { consolidateOrderLines } from "../shared/inventory";

describe("réservation de stock", () => {
  it("fusionne les lignes d’une même variante avant de réserver son stock", () => {
    expect(consolidateOrderLines([
      { productId: 10, variantId: 101, quantity: 1 },
      { productId: 10, variantId: 101, quantity: 2 },
      { productId: 10, variantId: 102, quantity: 1 },
    ])).toEqual([
      { variantId: 101, quantity: 3 },
      { variantId: 102, quantity: 1 },
    ]);
  });
});
