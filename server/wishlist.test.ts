import { describe, expect, it } from "vitest";
import { parseWishlistIds, toggleWishlistId } from "../shared/wishlist";

describe("wishlist persistence", () => {
  it("lit uniquement des identifiants de produits valides et uniques", () => {
    expect(parseWishlistIds("[1, 2, 1, -4, \"3\"]")).toEqual([1, 2]);
    expect(parseWishlistIds("not-json")).toEqual([]);
  });

  it("ajoute puis retire un parfum de la liste", () => {
    expect(toggleWishlistId([1, 2], 3)).toEqual([1, 2, 3]);
    expect(toggleWishlistId([1, 2, 3], 2)).toEqual([1, 3]);
  });
});
