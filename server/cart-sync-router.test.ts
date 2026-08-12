import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("cart.syncGuestCart", () => {
  it("requiert une session authentifiée", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as any, res: {} as any });

    await expect(caller.cart.syncGuestCart({
      syncKey: "guest-sync-key-unauthenticated",
      items: [{ productId: 1, quantity: 1 }],
    })).rejects.toThrow();
  });

  it("rejette les quantités invalides avant toute tentative d’écriture", async () => {
    const caller = appRouter.createCaller({
      user: {
        id: 4567,
        openId: "cart-sync-validation-user",
        name: "Test user",
        email: "test@example.com",
        loginMethod: "test",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {} as any,
      res: {} as any,
    });

    await expect(caller.cart.syncGuestCart({
      syncKey: "guest-sync-key-invalid-quantity",
      items: [{ productId: 1, quantity: 0 }],
    })).rejects.toThrow();
  });
});
