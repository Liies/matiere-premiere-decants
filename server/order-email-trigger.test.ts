import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getProductById: vi.fn(),
  createOrder: vi.fn(),
  createOrderItem: vi.fn(),
  clearUserCart: vi.fn(),
  getOrderById: vi.fn(),
  updateOrderStatus: vi.fn(),
  sendOrderCreatedEmails: vi.fn(),
  sendOrderStatusEmail: vi.fn(),
  notifyOwner: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getProductById: mocks.getProductById,
  createOrder: mocks.createOrder,
  createOrderItem: mocks.createOrderItem,
  clearUserCart: mocks.clearUserCart,
  getOrderById: mocks.getOrderById,
  updateOrderStatus: mocks.updateOrderStatus,
}));

vi.mock("./transactionalEmail", () => ({
  sendOrderCreatedEmails: mocks.sendOrderCreatedEmails,
  sendOrderStatusEmail: mocks.sendOrderStatusEmail,
}));

vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));

import { appRouter } from "./routers";

const customer = {
  id: 71,
  openId: "order-email-customer",
  email: "camille@example.com",
  name: "Camille Martin",
  loginMethod: "test",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const administrator = { ...customer, id: 72, role: "admin" as const };

const orderPayload = {
  customerName: "Camille Martin",
  customerEmail: "camille@example.com",
  shippingAddress: "12 rue des Fleurs",
  shippingCity: "Paris",
  shippingPostalCode: "75001",
  shippingCountry: "France",
  items: [{ productId: 1, quantity: 1, unitPrice: 8500 }],
  totalAmount: 8500,
};

describe("déclencheurs d’emails de commande", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getProductById.mockResolvedValue({ id: 1, name: "Vanilla Powder", stock: 10, price: 8500 });
    mocks.createOrder.mockResolvedValue({ insertId: 540 });
    mocks.createOrderItem.mockResolvedValue(undefined);
    mocks.clearUserCart.mockResolvedValue(undefined);
    mocks.notifyOwner.mockResolvedValue(true);
    mocks.sendOrderCreatedEmails.mockResolvedValue([
      { status: "fulfilled", value: { mode: "mock", delivered: true } },
      { status: "fulfilled", value: { mode: "mock", delivered: true } },
    ]);
    mocks.updateOrderStatus.mockResolvedValue(undefined);
    mocks.sendOrderStatusEmail.mockResolvedValue({ mode: "mock", delivered: true });
  });

  it("déclenche les deux emails après une commande sans retarder sa confirmation", async () => {
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    const result = await caller.orders.create(orderPayload);

    expect(result.success).toBe(true);
    expect(mocks.createOrder).toHaveBeenCalledWith(expect.objectContaining({
      userId: customer.id,
      totalAmount: 8500,
      status: "pending",
    }));
    expect(mocks.createOrderItem).toHaveBeenCalledWith({
      orderId: 540,
      productId: 1,
      productName: "Vanilla Powder",
      quantity: 1,
      unitPrice: 8500,
    });
    expect(mocks.clearUserCart).toHaveBeenCalledWith(customer.id);
    expect(mocks.sendOrderCreatedEmails).toHaveBeenCalledWith(expect.objectContaining({
      customerEmail: "camille@example.com",
      totalAmount: 8500,
      items: [{ productName: "Vanilla Powder", quantity: 1, unitPrice: 8500 }],
    }));
  });

  it("envoie un email client lors d’un vrai changement de statut", async () => {
    mocks.getOrderById.mockResolvedValue({
      id: 540,
      orderNumber: "MP-TEST-STATUS",
      customerName: "Camille Martin",
      customerEmail: "camille@example.com",
      status: "pending",
    });
    const caller = appRouter.createCaller({ user: administrator, req: {} as any, res: {} as any });

    await caller.orders.updateStatus({ orderId: 540, status: "shipped" });

    expect(mocks.sendOrderStatusEmail).toHaveBeenCalledWith({
      orderNumber: "MP-TEST-STATUS",
      customerName: "Camille Martin",
      customerEmail: "camille@example.com",
      status: "shipped",
    });
  });

  it("ne bloque pas la commande si le service d’email échoue", async () => {
    mocks.sendOrderCreatedEmails.mockRejectedValue(new Error("Service temporairement indisponible"));
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    await expect(caller.orders.create(orderPayload)).resolves.toMatchObject({ success: true });
  });

  it("refuse un panier vide avant de créer une commande", async () => {
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    await expect(caller.orders.create({ ...orderPayload, items: [], totalAmount: 0 })).rejects.toThrow("Aucun article");
    expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.clearUserCart).not.toHaveBeenCalled();
  });

  it("refuse un montant altéré ou un produit absent sans vider le panier", async () => {
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    await expect(caller.orders.create({
      ...orderPayload,
      items: [{ productId: 1, quantity: 1, unitPrice: 1 }],
      totalAmount: 1,
    })).rejects.toThrow("Montant invalide");
    expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.clearUserCart).not.toHaveBeenCalled();

    mocks.getProductById.mockResolvedValueOnce(undefined);
    await expect(caller.orders.create(orderPayload)).rejects.toThrow("Produit 1 non trouvé");
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("refuse un stock insuffisant sans créer ni envoyer une commande", async () => {
    mocks.getProductById.mockResolvedValueOnce({ id: 1, name: "Vanilla Powder", stock: 0, price: 8500 });
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    await expect(caller.orders.create(orderPayload)).rejects.toThrow("Stock insuffisant");
    expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.sendOrderCreatedEmails).not.toHaveBeenCalled();
    expect(mocks.clearUserCart).not.toHaveBeenCalled();
  });
});
