import { describe, expect, it } from "vitest";
import { isCollectionPageTransition, PAGE_TRANSITION_DURATION_MS, shouldUseInstantPageTransition } from "@shared/page-transition";

describe("transitions de page", () => {
  it("conserve une navigation instantanée dans le panier et le checkout", () => {
    expect(shouldUseInstantPageTransition("/cart")).toBe(true);
    expect(shouldUseInstantPageTransition("/checkout")).toBe(true);
    expect(shouldUseInstantPageTransition("/checkout/success")).toBe(true);
  });

  it("anime les vues éditoriales et catalogue", () => {
    expect(shouldUseInstantPageTransition("/")).toBe(false);
    expect(shouldUseInstantPageTransition("/products")).toBe(false);
    expect(shouldUseInstantPageTransition("/product/1")).toBe(false);
    expect(PAGE_TRANSITION_DURATION_MS).toBe(160);
  });

  it("identifie le passage entre catalogue et favoris pour une transition dédiée", () => {
    expect(isCollectionPageTransition("/products", "/wishlist")).toBe(true);
    expect(isCollectionPageTransition("/wishlist", "/products")).toBe(true);
    expect(isCollectionPageTransition("/products", "/products")).toBe(false);
    expect(isCollectionPageTransition("/wishlist", "/cart")).toBe(false);
  });
});
