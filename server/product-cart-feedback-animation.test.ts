import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const productDetailSource = readFileSync(new URL("../client/src/pages/ProductDetail.tsx", import.meta.url), "utf8");

describe("animation de confirmation panier sur la fiche produit", () => {
  it("compose une confirmation animée, avec un repli respectueux de la réduction des mouvements", () => {
    expect(productDetailSource).toContain("product-cart-success-state");
    expect(productDetailSource).toContain("product-cart-success-sweep");
    expect(productDetailSource).toContain("product-cart-success-check");
    expect(productDetailSource).toContain("@keyframes productCartSuccessSweep");
    expect(productDetailSource).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
