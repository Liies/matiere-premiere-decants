import { describe, expect, it } from "vitest";
import { BRANDS, buildStructuredNotes, MULTI_BRAND_CATALOG } from "../shared/catalog-data";

describe("catalogue multi-maisons", () => {
  it("restitue les 56 références réparties sur 14 maisons", () => {
    expect(BRANDS).toHaveLength(14);
    expect(MULTI_BRAND_CATALOG).toHaveLength(56);
    expect(new Set(MULTI_BRAND_CATALOG.map((product) => `${product.brandSlug}/${product.slug}`)).size).toBe(56);
  });

  it("conserve les références signalées indisponibles sans les supprimer du catalogue", () => {
    expect(MULTI_BRAND_CATALOG.filter((product) => product.status === "out_of_stock").map((product) => product.slug).sort()).toEqual([
      "limmensite",
      "ombre-nomade",
      "rouge-trafalgar",
    ]);
  });

  it("relie les variantes de rose à une note parent structurée", () => {
    const notes = buildStructuredNotes();
    expect(notes.find((note) => note.slug === "rose-bulgare")).toMatchObject({ parentSlug: "rose" });
    expect(notes.find((note) => note.slug === "rose")).toMatchObject({ family: "floral" });
  });
});
