import { describe, expect, it } from "vitest";
import { PAGE_TRANSITION_DURATION_MS, shouldUseInstantPageTransition } from "@shared/page-transition";

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
});
