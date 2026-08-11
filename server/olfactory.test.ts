import { describe, expect, it } from "vitest";
import {
  filterProductsByNotes,
  productMatchesOlfactoryFilter,
} from "../shared/olfactory";
import { MATIERE_PREMIERE_PRODUCTS } from "../shared/products-data";

describe("filtres olfactifs du catalogue", () => {
  it("filtre les parfums boisés à partir des trois pyramides olfactives", () => {
    const products = filterProductsByNotes(MATIERE_PREMIERE_PRODUCTS, ["boise"]);

    expect(products.map((product) => product.name)).toEqual(
      expect.arrayContaining(["Santal Austral", "Bois d'Ébène"]),
    );
    expect(products.length).toBeGreaterThanOrEqual(2);
  });

  it("combine plusieurs familles en mode au moins une note correspondante", () => {
    const products = filterProductsByNotes(MATIERE_PREMIERE_PRODUCTS, ["cuire", "floral"]);
    const names = products.map((product) => product.name);

    expect(names).toEqual(expect.arrayContaining(["Falcon Leather", "Radical Rose"]));
  });

  it("retourne tout le catalogue quand aucun filtre n'est actif", () => {
    expect(filterProductsByNotes(MATIERE_PREMIERE_PRODUCTS, [])).toEqual(MATIERE_PREMIERE_PRODUCTS);
  });

  it("compare les notes sans tenir compte des accents", () => {
    const product = {
      topNotes: "Vétiver de Haïti",
      heartNotes: "Bois clair",
      baseNotes: "Musc blanc",
    };

    expect(productMatchesOlfactoryFilter(product, "boise")).toBe(true);
  });

  it("ignore un identifiant de filtre inconnu sans faire correspondre le produit", () => {
    expect(productMatchesOlfactoryFilter(MATIERE_PREMIERE_PRODUCTS[0], "inconnu")).toBe(false);
  });
});
