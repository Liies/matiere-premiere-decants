import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  markPaid: vi.fn(),
  releaseExpired: vi.fn(),
  notifyOwner: vi.fn(),
  sendEmails: vi.fn(),
}));

vi.mock("./db", () => ({
  markStripeCheckoutOrderPaid: state.markPaid,
  releaseExpiredStripeCheckoutOrder: state.releaseExpired,
}));
vi.mock("./_core/notification", () => ({ notifyOwner: state.notifyOwner }));
vi.mock("./transactionalEmail", () => ({ sendOrderCreatedEmails: state.sendEmails }));

import { processStripeWebhookEvent } from "./stripeWebhook";

describe("webhook Stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("confirme une commande payée et envoie les notifications une seule fois", async () => {
    state.markPaid.mockResolvedValue({
      changed: true,
      order: {
        orderNumber: "MP-PAID-1",
        customerName: "Camille Martin",
        customerEmail: "camille@example.com",
        totalAmount: 12_495,
      },
      items: [{ productName: "Radical Rose", quantity: 1, unitPrice: 12_000 }],
    });
    state.notifyOwner.mockResolvedValue(true);
    state.sendEmails.mockResolvedValue([]);

    await processStripeWebhookEvent({
      type: "checkout.session.completed",
      data: { object: { id: "cs_paid", payment_status: "paid", payment_intent: "pi_paid", metadata: { order_id: "42" } } },
    } as any);

    expect(state.markPaid).toHaveBeenCalledWith({ orderId: 42, stripeCheckoutSessionId: "cs_paid", stripePaymentIntentId: "pi_paid" });
    expect(state.notifyOwner).toHaveBeenCalledTimes(1);
    expect(state.sendEmails).toHaveBeenCalledWith(expect.objectContaining({ orderNumber: "MP-PAID-1", totalAmount: 12_495 }));
  });

  it("ignore une session complétée qui n’est pas encore payée", async () => {
    await processStripeWebhookEvent({
      type: "checkout.session.completed",
      data: { object: { id: "cs_pending", payment_status: "unpaid", metadata: { order_id: "42" } } },
    } as any);

    expect(state.markPaid).not.toHaveBeenCalled();
  });

  it("libère la réservation lorsqu’une session Stripe expire", async () => {
    state.releaseExpired.mockResolvedValue({ released: true });

    await processStripeWebhookEvent({ type: "checkout.session.expired", data: { object: { id: "cs_expired" } } } as any);

    expect(state.releaseExpired).toHaveBeenCalledWith("cs_expired");
  });
});
