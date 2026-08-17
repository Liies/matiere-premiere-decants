import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ createSession: vi.fn() }));

vi.mock("stripe", () => ({
  default: class StripeMock {
    checkout = { sessions: { create: state.createSession } };
  },
}));

import { getStripeRuntimeConfig, getStripeWebhookSecret } from "./stripeConfig";
import { createStripeCheckoutSession } from "./stripeCheckout";

describe("Stripe Checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_checkout";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_checkout";
    state.createSession.mockResolvedValue({ id: "cs_checkout_1", url: "https://checkout.stripe.test/cs_checkout_1" });
  });

  it("prépare les lignes de commande, livraison et métadonnées sans faire confiance au client", async () => {
    const session = await createStripeCheckoutSession({
      orderId: 91,
      orderNumber: "MP-91",
      userId: 7,
      customerEmail: "camille@example.com",
      customerName: "Camille Martin",
      shippingCost: 495,
      lines: [{ productName: "Radical Rose", sizeMl: 50, quantity: 1, unitPrice: 12_000 }],
      origin: "https://boutique.example",
    });

    expect(session).toEqual({ id: "cs_checkout_1", url: "https://checkout.stripe.test/cs_checkout_1" });
    expect(state.createSession).toHaveBeenCalledWith(expect.objectContaining({
      mode: "payment",
      customer_email: "camille@example.com",
      client_reference_id: "7",
      allow_promotion_codes: true,
      success_url: "https://boutique.example/checkout?payment=success&order_id=91",
      cancel_url: "https://boutique.example/checkout?payment=cancelled&order_id=91",
      metadata: expect.objectContaining({ order_id: "91", order_number: "MP-91", user_id: "7" }),
      line_items: expect.arrayContaining([
        expect.objectContaining({ quantity: 1, price_data: expect.objectContaining({ unit_amount: 12_000 }) }),
        expect.objectContaining({ quantity: 1, price_data: expect.objectContaining({ unit_amount: 495 }) }),
      ]),
    }));
  });

  it("identifie explicitement les configurations test et réel valides", () => {
    expect(getStripeRuntimeConfig()).toMatchObject({ mode: "test", secretKey: "sk_test_checkout" });
    process.env.STRIPE_SECRET_KEY = "rk_live_prepared";
    expect(getStripeRuntimeConfig()).toMatchObject({ mode: "live", secretKey: "rk_live_prepared" });
    expect(getStripeWebhookSecret()).toBe("whsec_test_checkout");
  });

  it("refuse une clé Stripe ou un secret de webhook invalide", () => {
    process.env.STRIPE_SECRET_KEY = "pk_live_public";
    process.env.STRIPE_WEBHOOK_SECRET = "invalid";

    expect(getStripeRuntimeConfig).toThrow("clé Stripe");
    expect(getStripeWebhookSecret).toThrow("secret de signature");
  });
});
