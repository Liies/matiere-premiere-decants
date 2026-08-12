import { describe, expect, it } from "vitest";
import { getCatalogSuggestions, searchProductsByName } from "../shared/catalog-search";
import { MATIERE_PREMIERE_PRODUCTS } from "../shared/products-data";

describe("recherche catalogue par nom", () => {
  it("trouve un parfum avec une correspondance partielle en temps réel", () => {
    const results = searchProductsByName(MATIERE_PREMIERE_PRODUCTS, "safr");

    expect(results.map((product) => product.name)).toEqual(["Crystal Safran"]);
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

  it("limite les suggestions et conserve l'ordre du catalogue", () => {
    const suggestions = getCatalogSuggestions(MATIERE_PREMIERE_PRODUCTS, "a", 3);

    expect(suggestions).toHaveLength(3);
    expect(suggestions.map((product) => product.name)).toEqual([
      "Encens Suave",
      "Falcon Leather",
      "Radical Rose",
    ]);
  });

  it("retourne les suggestions liées aux parfums filtrés par la saisie", () => {
    const suggestions = getCatalogSuggestions(MATIERE_PREMIERE_PRODUCTS, "neroli");

    expect(suggestions.map((product) => product.name)).toEqual(["Néroli Oranger"]);
  });
});
