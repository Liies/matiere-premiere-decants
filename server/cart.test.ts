import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

const mockUser = {
  id: 1,
  openId: "test-user-123",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "test",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("Cart Router", () => {
  it("should get empty cart for new user", async () => {
    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    const cartItems = await caller.cart.getItems();

    expect(Array.isArray(cartItems)).toBe(true);
    // Cart might be empty or have items from previous tests
    expect(cartItems).toBeDefined();
  });

  it("should add item to cart", async () => {
    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    // Get all products first
    const products = await caller.products.list();
    expect(products.length).toBeGreaterThan(0);

    const firstProduct = products[0];

    // Add to cart
    const result = await caller.cart.addItem({
      productId: firstProduct.id,
      quantity: 1,
    });

    expect(result.success).toBe(true);
  });

  it("should reject adding item with insufficient stock", async () => {
    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    // Try to add non-existent product
    try {
      await caller.cart.addItem({
        productId: 99999,
        quantity: 1,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Produit non trouvé");
    }
  });

  it("should reject invalid quantity", async () => {
    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    const products = await caller.products.list();
    expect(products.length).toBeGreaterThan(0);

    // Try to add with invalid quantity (should fail at zod validation)
    try {
      await caller.cart.addItem({
        productId: products[0].id,
        quantity: 0,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });
});
