import { describe, expect, it } from "vitest";
import {
  canAddToCart,
  getProductQuantityInCart,
  getVariantQuantityInCart,
  hasSufficientStock,
} from "../shared/cart-domain";

const lines = [
  { productId: 1, quantity: 2, variantId: 10 },
  { productId: 1, quantity: 1, variantId: 11 },
  { productId: 2, quantity: 3, variantId: 10 },
] as const;

describe("règles de domaine du panier", () => {
  it("additionne les quantités au bon niveau de produit ou de variante", () => {
    expect(getProductQuantityInCart(lines, 1)).toBe(3);
    expect(getProductQuantityInCart(lines, 2)).toBe(3);
    expect(getVariantQuantityInCart(lines, 10)).toBe(5);
    expect(getVariantQuantityInCart(lines, 11)).toBe(1);
  });

  it("évalue la disponibilité sans dépendre du stockage ou de la couche HTTP", () => {
    expect(hasSufficientStock(4, 4)).toBe(true);
    expect(hasSufficientStock(3, 4)).toBe(false);
    expect(canAddToCart(5, 3, 2)).toBe(true);
    expect(canAddToCart(4, 3, 2)).toBe(false);
  });
});
