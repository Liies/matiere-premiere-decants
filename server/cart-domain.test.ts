import { describe, expect, it } from "vitest";
import {
  canAddToCart,
  getProductVolumeInCart,
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

  it("calcule le volume partagé entre les contenances d’un même parfum", () => {
    const variants = [
      { id: 10, productId: 1, sizeMl: 2 },
      { id: 11, productId: 1, sizeMl: 50 },
      { id: 12, productId: 2, sizeMl: 2 },
    ];
    const cartLines = [
      { id: 1, productId: 1, variantId: 10, quantity: 4 },
      { id: 2, productId: 1, variantId: 11, quantity: 1 },
      { id: 3, productId: 2, variantId: 12, quantity: 3 },
    ];

    expect(getProductVolumeInCart(cartLines, variants, 1)).toBe(58);
    expect(getProductVolumeInCart(cartLines, variants, 1, { cartItemId: 1, quantity: 10 })).toBe(70);
    expect(getProductVolumeInCart(cartLines, variants, 2)).toBe(6);
  });
});
