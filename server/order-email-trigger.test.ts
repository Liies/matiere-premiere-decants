import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createReservedOrder: vi.fn(),
  getOrderById: vi.fn(),
  getOrderItems: vi.fn(),
  setOrderStripeCheckoutSession: vi.fn(),
  releaseReservedOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
  sendOrderStatusEmail: vi.fn(),
  notifyOwner: vi.fn(),
  createStripeCheckoutSession: vi.fn(),
  getStripeClient: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  createReservedOrder: mocks.createReservedOrder,
  getOrderById: mocks.getOrderById,
  getOrderItems: mocks.getOrderItems,
  setOrderStripeCheckoutSession: mocks.setOrderStripeCheckoutSession,
  releaseReservedOrder: mocks.releaseReservedOrder,
  updateOrderStatus: mocks.updateOrderStatus,
}));
vi.mock("./transactionalEmail", () => ({ sendOrderStatusEmail: mocks.sendOrderStatusEmail }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));
vi.mock("./stripeCheckout", () => ({
  createStripeCheckoutSession: mocks.createStripeCheckoutSession,
  getStripeClient: mocks.getStripeClient,
}));

import { appRouter } from "./routers";

const customer = {
  id: 71, openId: "order-email-customer", email: "camille@example.com", name: "Camille Martin", loginMethod: "test", role: "user" as const,
  createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
};
const administrator = { ...customer, id: 72, role: "admin" as const };
const context = (user = customer) => ({ user, req: { headers: { origin: "https://boutique.test" } } as any, res: {} as any });
const orderPayload = {
  customerName: "Camille Martin", customerEmail: "camille@example.com", shippingAddress: "12 rue des Fleurs", shippingCity: "Paris", shippingPostalCode: "75001", shippingCountry: "France",
  items: [{ productId: 1, variantId: 101, quantity: 1, unitPrice: 8500 }], totalAmount: 8500,
};

describe("préparation Stripe d’une commande", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createReservedOrder.mockResolvedValue({ orderId: 540, orderNumber: "MP-TEST", totalAmount: 8500, shippingCost: 0, items: [{ productName: "Vanille Powder", quantity: 1, unitPrice: 8500 }] });
    mocks.getOrderItems.mockResolvedValue([{ productName: "Vanille Powder", sizeMl: 50, quantity: 1, unitPrice: 8500 }]);
    mocks.setOrderStripeCheckoutSession.mockResolvedValue(undefined);
    mocks.releaseReservedOrder.mockResolvedValue({ released: true });
    mocks.createStripeCheckoutSession.mockResolvedValue({ id: "cs_test_order", url: "https://checkout.stripe.test/cs_test_order" });
    mocks.updateOrderStatus.mockResolvedValue(undefined);
    mocks.sendOrderStatusEmail.mockResolvedValue({ mode: "mock", delivered: true });
    mocks.notifyOwner.mockResolvedValue(true);
  });

  it("réserve le stock puis prépare Stripe sans envoyer de confirmation avant paiement", async () => {
    const result = await appRouter.createCaller(context()).orders.create(orderPayload);

    expect(result).toMatchObject({ success: true, checkoutUrl: "https://checkout.stripe.test/cs_test_order" });
    expect(result.orderNumber).toMatch(/^MP-/);
    expect(mocks.createReservedOrder).toHaveBeenCalledWith(expect.objectContaining({ userId: customer.id, requestedTotalAmount: 8500, lines: [{ variantId: 101, quantity: 1, unitPrice: 8500 }] }));
    expect(mocks.createStripeCheckoutSession).toHaveBeenCalledWith(expect.objectContaining({ orderId: 540, origin: "https://boutique.test" }));
    expect(mocks.setOrderStripeCheckoutSession).toHaveBeenCalledWith(540, "cs_test_order");
  });

  it("libère la réservation si Stripe ne peut pas créer la session", async () => {
    mocks.createStripeCheckoutSession.mockRejectedValueOnce(new Error("Stripe indisponible"));

    await expect(appRouter.createCaller(context()).orders.create(orderPayload)).rejects.toThrow("Impossible de préparer le paiement sécurisé");
    expect(mocks.releaseReservedOrder).toHaveBeenCalledWith(540);
  });

  it("envoie un email client lors d’un changement de statut effectué par un administrateur", async () => {
    mocks.getOrderById.mockResolvedValue({ id: 540, orderNumber: "MP-TEST-STATUS", customerName: "Camille Martin", customerEmail: "camille@example.com", status: "pending" });

    await appRouter.createCaller(context(administrator)).orders.updateStatus({ orderId: 540, status: "shipped" });

    expect(mocks.sendOrderStatusEmail).toHaveBeenCalledWith({ orderNumber: "MP-TEST-STATUS", customerName: "Camille Martin", customerEmail: "camille@example.com", status: "shipped" });
  });

  it("refuse un panier vide ou une adresse hors zone avant toute réservation", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.orders.create({ ...orderPayload, items: [], totalAmount: 0 })).rejects.toThrow("Aucun article");
    await expect(caller.orders.create({ ...orderPayload, shippingCountry: "États-Unis", shippingPostalCode: "94105" })).rejects.toThrow("France métropolitaine et en Europe");
    expect(mocks.createReservedOrder).not.toHaveBeenCalled();
  });

  it("laisse au serveur la détermination effective des prix et produits", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.orders.create({ ...orderPayload, items: [{ productId: 1, variantId: 101, quantity: 1, unitPrice: 1 }], totalAmount: 1 })).resolves.toMatchObject({ success: true });
    expect(mocks.createReservedOrder).toHaveBeenCalledWith(expect.objectContaining({ lines: [{ variantId: 101, quantity: 1, unitPrice: 1 }] }));
  });
});
