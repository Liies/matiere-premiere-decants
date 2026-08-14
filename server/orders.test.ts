import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createReservedOrder: vi.fn(),
  notifyOwner: vi.fn(),
  sendOrderCreatedEmails: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  createReservedOrder: mocks.createReservedOrder,
}));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));
vi.mock("./transactionalEmail", () => ({
  sendOrderCreatedEmails: mocks.sendOrderCreatedEmails,
  sendOrderStatusEmail: vi.fn(),
}));

import { InventoryUnavailableError } from "./db";
import { appRouter } from "./routers";

const customer = {
  id: 91,
  openId: "orders-concurrency-customer",
  email: "client@example.com",
  name: "Client Test",
  loginMethod: "test",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const orderPayload = {
  customerName: "Client Test",
  customerEmail: "client@example.com",
  shippingAddress: "10 rue de Rivoli",
  shippingCity: "Paris",
  shippingPostalCode: "75001",
  shippingCountry: "France",
  items: [{ variantId: 101, quantity: 1 }],
  totalAmount: 1_000,
};

describe("orders.create — concurrence de stock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.notifyOwner.mockResolvedValue(true);
    mocks.sendOrderCreatedEmails.mockResolvedValue([]);
  });

  it("autorise exactement une commande concurrente sur la dernière unité", async () => {
    let remainingStock = 1;
    mocks.createReservedOrder.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (remainingStock < 1) throw new InventoryUnavailableError("Stock insuffisant pour ce format");
      remainingStock -= 1;
      return {
        orderId: 700,
        orderNumber: "MP-CONCURRENT",
        totalAmount: 1_000,
        items: [{ productName: "Vanilla Powder", quantity: 1, unitPrice: 1_000 }],
      };
    });

    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });
    const results = await Promise.allSettled([
      caller.orders.create(orderPayload),
      caller.orders.create(orderPayload),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
    expect(remainingStock).toBe(0);
    expect(mocks.createReservedOrder).toHaveBeenCalledTimes(2);
  });
});
