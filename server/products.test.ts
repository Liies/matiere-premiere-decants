import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("Products Router", () => {
  it("should list all products", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const products = await caller.products.list();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    // Check that products have required fields
    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty("id");
    expect(firstProduct).toHaveProperty("name");
    expect(firstProduct).toHaveProperty("price");
    expect(firstProduct).toHaveProperty("stock");
    expect(firstProduct).toHaveProperty("description");
    expect(firstProduct).toHaveProperty("topNotes");
    expect(firstProduct).toHaveProperty("heartNotes");
    expect(firstProduct).toHaveProperty("baseNotes");
  });

  it("should get product by id", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    // First get all products
    const products = await caller.products.list();
    expect(products.length).toBeGreaterThan(0);

    // Then get a specific product
    const firstProductId = products[0].id;
    const product = await caller.products.getById({ id: firstProductId });

    expect(product).toBeDefined();
    expect(product?.id).toBe(firstProductId);
    expect(product?.name).toBeDefined();
    expect(product?.price).toBeGreaterThan(0);
  });

  it("should return undefined for non-existent product", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const product = await caller.products.getById({ id: 99999 });

    expect(product).toBeUndefined();
  });
});
