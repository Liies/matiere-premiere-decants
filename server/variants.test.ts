import { describe, expect, it } from "vitest";
import type { Variant } from "../drizzle/schema";
import {
  computePricePerMlCents,
  formatSize,
  getDefaultVariant,
  getPriceRange,
  isVariantAvailable,
  sortVariants,
} from "../shared/variants";

function variant(overrides: Partial<Variant> = {}): Variant {
  return {
    id: 1,
    productId: 1,
    sizeMl: 2,
    sku: "MP-TEST-02",
    priceCents: 1_000,
    stock: 10,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("règles de variantes", () => {
  it("retourne null pour une collection vide", () => {
    expect(getDefaultVariant([])).toBeNull();
    expect(getPriceRange([])).toBeNull();
  });

  it("ignore les variantes inactives", () => {
    const inactive = variant({ isActive: false, stock: 20 });
    expect(getDefaultVariant([inactive])).toBeNull();
    expect(getPriceRange([inactive])).toBeNull();
    expect(isVariantAvailable(inactive)).toBe(false);
  });

  it("privilégie la plus petite variante active encore en stock", () => {
    const twoMl = variant({ id: 2, sizeMl: 2, stock: 0, sortOrder: 1 });
    const fiftyMl = variant({ id: 50, sizeMl: 50, stock: 4, sortOrder: 2, priceCents: 12_000 });
    expect(getDefaultVariant([fiftyMl, twoMl])).toEqual(fiftyMl);
    expect(isVariantAvailable(twoMl)).toBe(false);
  });

  it("retourne la plus petite variante active lorsque toutes sont en rupture", () => {
    const twoMl = variant({ id: 2, sizeMl: 2, stock: 0, sortOrder: 1 });
    const fiftyMl = variant({ id: 50, sizeMl: 50, stock: 0, sortOrder: 2, priceCents: 12_000 });
    expect(getDefaultVariant([fiftyMl, twoMl])).toEqual(twoMl);
  });

  it("calcule une fourchette de prix, le prix au millilitre arrondi et le format", () => {
    const twoMl = variant({ id: 2, sizeMl: 2, priceCents: 1_000 });
    const fiftyMl = variant({ id: 50, sizeMl: 50, priceCents: 12_000 });
    expect(getPriceRange([fiftyMl, twoMl])).toEqual({ minCents: 1_000, maxCents: 12_000 });
    expect(computePricePerMlCents(variant({ sizeMl: 3, priceCents: 1_000 }))).toBe(333);
    expect(formatSize(50)).toBe("50 ml");
  });

  it("trie de manière déterministe quand les ordres commerciaux sont égaux", () => {
    const fiftyMl = variant({ id: 50, sizeMl: 50, sortOrder: 1, priceCents: 12_000 });
    const twoMl = variant({ id: 2, sizeMl: 2, sortOrder: 1 });
    expect(sortVariants([fiftyMl, twoMl]).map((item) => item.id)).toEqual([2, 50]);
  });
});
