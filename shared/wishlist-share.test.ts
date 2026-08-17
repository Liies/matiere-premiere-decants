import { describe, expect, it } from "vitest";
import { createSharedWishlistPath, parseSharedWishlistIds } from "./wishlist-share";

describe("partage de liste de souhaits", () => {
  it("construit un lien compact à partir d’une sélection valide et unique", () => {
    expect(createSharedWishlistPath([20, 10, 20, -1, 0])).toBe("/wishlist?selection=20,10");
  });

  it("lit uniquement les identifiants positifs d’un lien partagé", () => {
    expect(parseSharedWishlistIds("?selection=20,10,20,erreur,0,-2")).toEqual([20, 10]);
    expect(parseSharedWishlistIds("?selection=")).toEqual([]);
  });
});
