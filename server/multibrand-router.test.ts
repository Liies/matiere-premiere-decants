import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCatalogProducts: vi.fn(),
  getBrands: vi.fn(),
  getProductByBrandSlug: vi.fn(),
  getProductVariants: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getCatalogProducts: mocks.getCatalogProducts,
  getBrands: mocks.getBrands,
  getProductByBrandSlug: mocks.getProductByBrandSlug,
  getProductVariants: mocks.getProductVariants,
}));

import { appRouter } from "./routers";

const publicContext = { user: null, req: {} as any, res: {} as any };

describe("endpoints catalogue multi-maisons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getProductVariants.mockResolvedValue([{ id: 22, sizeMl: 5, priceCents: 1800, availableQuantity: 3 }]);
  });

  it("aplatit le produit et sa maison pour la liste publique", async () => {
    mocks.getCatalogProducts.mockResolvedValue([{
      product: { id: 12, name: "Oud Satin Mood", slug: "oud-satin-mood" },
      brand: { id: 4, name: "Maison Francis Kurkdjian", slug: "maison-francis-kurkdjian" },
    }]);
    const caller = appRouter.createCaller(publicContext);

    await expect(caller.products.list()).resolves.toEqual([{
      id: 12,
      name: "Oud Satin Mood",
      slug: "oud-satin-mood",
      brand: { id: 4, name: "Maison Francis Kurkdjian", slug: "maison-francis-kurkdjian" },
      variants: [{ id: 22, sizeMl: 5, priceCents: 1800, availableQuantity: 3 }],
    }]);
  });

  it("résout une fiche publique via le couple maison/slug", async () => {
    const expectedProduct = {
      id: 12,
      name: "Oud Satin Mood",
      slug: "oud-satin-mood",
      brand: { slug: "maison-francis-kurkdjian" },
      variants: [{ id: 22, sizeMl: 5, priceCents: 1800, availableQuantity: 3 }],
    };
    mocks.getProductByBrandSlug.mockResolvedValue(expectedProduct);
    const caller = appRouter.createCaller(publicContext);

    await expect(caller.products.getByBrandSlug({
      brand: "maison-francis-kurkdjian",
      slug: "oud-satin-mood",
    })).resolves.toEqual(expectedProduct);
    expect(mocks.getProductByBrandSlug).toHaveBeenCalledWith("maison-francis-kurkdjian", "oud-satin-mood");
  });
});
