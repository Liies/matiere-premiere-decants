import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCatalogProducts: vi.fn(),
  getBrands: vi.fn(),
  getProductBySlug: vi.fn(),
  getProductByBrandSlug: vi.fn(),
  getProductVariants: vi.fn(),
  getVariantsByProductIds: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getCatalogProducts: mocks.getCatalogProducts,
  getBrands: mocks.getBrands,
  getProductBySlug: mocks.getProductBySlug,
  getProductByBrandSlug: mocks.getProductByBrandSlug,
  getProductVariants: mocks.getProductVariants,
  getVariantsByProductIds: mocks.getVariantsByProductIds,
}));

import { appRouter } from "./routers";

const publicContext = { user: null, req: {} as any, res: {} as any };
const catalogVariant = {
  id: 22,
  productId: 12,
  sizeMl: 5,
  sku: "MP-RADICALROSE-05",
  priceCents: 1800,
  stock: 3,
  isActive: true,
  sortOrder: 1,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("endpoints catalogue Matière Première", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getVariantsByProductIds.mockResolvedValue([catalogVariant]);
  });

  it("aplatit le produit Matière Première et ses variantes actives pour la liste publique", async () => {
    mocks.getCatalogProducts.mockResolvedValue([{
      product: { id: 12, name: "Radical Rose", slug: "radical-rose" },
      brand: { id: 4, name: "Matière Première", slug: "matiere-premiere" },
    }]);
    const caller = appRouter.createCaller(publicContext);

    await expect(caller.products.list()).resolves.toEqual([{
      id: 12,
      name: "Radical Rose",
      slug: "radical-rose",
      brand: { id: 4, name: "Matière Première", slug: "matiere-premiere" },
      variants: [catalogVariant],
    }]);
    expect(mocks.getCatalogProducts).toHaveBeenCalledWith("matiere-premiere");
    expect(mocks.getVariantsByProductIds).toHaveBeenCalledWith([12]);
  });

  it("refuse une fiche publique d’une autre maison", async () => {
    const caller = appRouter.createCaller(publicContext);

    await expect(caller.products.getByBrandSlug({
      brand: "maison-francis-kurkdjian",
      slug: "oud-satin-mood",
    })).resolves.toBeUndefined();
    expect(mocks.getProductByBrandSlug).not.toHaveBeenCalled();
  });

  it("résout une fiche publique via le couple Matière Première/slug", async () => {
    const expectedProduct = {
      id: 12,
      name: "Radical Rose",
      slug: "radical-rose",
      brand: { slug: "matiere-premiere" },
      variants: [{ id: 22, sizeMl: 5, priceCents: 1800, availableQuantity: 3 }],
    };
    mocks.getProductByBrandSlug.mockResolvedValue(expectedProduct);
    const caller = appRouter.createCaller(publicContext);

    await expect(caller.products.getByBrandSlug({
      brand: "matiere-premiere",
      slug: "radical-rose",
    })).resolves.toEqual(expectedProduct);
    expect(mocks.getProductByBrandSlug).toHaveBeenCalledWith("matiere-premiere", "radical-rose");
  });

  it("ne publie pas une fiche trouvée par slug si elle ne relève pas de Matière Première", async () => {
    mocks.getProductBySlug.mockResolvedValue({ id: 12, slug: "oud-satin-mood" });
    mocks.getProductByBrandSlug.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(publicContext);

    await expect(caller.products.getBySlug({ slug: "oud-satin-mood" })).resolves.toBeUndefined();
    expect(mocks.getProductByBrandSlug).toHaveBeenCalledWith("matiere-premiere", "oud-satin-mood");
  });
});
