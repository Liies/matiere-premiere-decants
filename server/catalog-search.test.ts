import { describe, expect, it } from "vitest";
import { searchProductsByName } from "../shared/catalog-search";
import { MATIERE_PREMIERE_PRODUCTS } from "../shared/products-data";

describe("recherche catalogue par nom", () => {
  it("trouve un parfum avec une correspondance partielle en temps réel", () => {
    const results = searchProductsByName(MATIERE_PREMIERE_PRODUCTS, "saff");

    expect(results.map((product) => product.name)).toEqual(["Crystal Saffron"]);
  });

  it("ignore la casse et les accents", () => {
    const results = searchProductsByName(MATIERE_PREMIERE_PRODUCTS, "ebene");

    expect(results.map((product) => product.name)).toEqual(["Bois d'Ébène"]);
  });

  it("retourne tous les produits lorsque la recherche est vide", () => {
    expect(searchProductsByName(MATIERE_PREMIERE_PRODUCTS, "   ")).toEqual(MATIERE_PREMIERE_PRODUCTS);
  });

  it("retourne une liste vide quand aucun nom ne correspond", () => {
    expect(searchProductsByName(MATIERE_PREMIERE_PRODUCTS, "rose noire")).toEqual([]);
  });
});
