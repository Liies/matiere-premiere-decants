import { describe, expect, it } from "vitest";
import { getProductImage } from "../shared/image-assets";

describe("getProductImage", () => {
  it("résout un asset persistant pour chacun des dix parfums", () => {
    for (let productId = 1; productId <= 10; productId += 1) {
      const asset = getProductImage(productId);

      expect(asset).not.toBeNull();
      expect(asset?.compressed).toMatch(/^\/manus-storage\/perfume-bottle-\d+_[a-z0-9]+\.png$/);
    }
  });

  it("retourne null pour un produit non mappé", () => {
    expect(getProductImage(999)).toBeNull();
  });
});

// Keep this test close to the shared mapping so ProductDetail and Products
// cannot silently drift apart again.
expect.extend({});
