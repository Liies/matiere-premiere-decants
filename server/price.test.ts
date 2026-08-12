import { describe, expect, it } from "vitest";
import { formatPrice } from "../shared/price";
import { MATIERE_PREMIERE_PRODUCTS, UNIFORM_CATALOG_PRICE_CENTS } from "../shared/products-data";

describe("formatPrice", () => {
  it("formate les centimes en prix français cohérent avec le catalogue", () => {
    expect(formatPrice(8500)).toBe("85,00 €");
    expect(formatPrice(9500)).toBe("95,00 €");
    expect(formatPrice(UNIFORM_CATALOG_PRICE_CENTS)).toBe("120,00 €");
  });

  it("référence un prix unique de 120,00 € pour chaque parfum du catalogue", () => {
    expect(MATIERE_PREMIERE_PRODUCTS).toHaveLength(11);
    expect(MATIERE_PREMIERE_PRODUCTS.every((product) => product.price === UNIFORM_CATALOG_PRICE_CENTS)).toBe(true);
  });
});
