import { describe, expect, it, vi } from "vitest";
import {
  CheckoutPreparationError,
  DeliveryAddressOutOfZoneError,
  prepareOrderCheckout,
  type CreateOrderCheckoutInput,
  type OrderCheckoutDependencies,
} from "./orderCheckout";

const input: CreateOrderCheckoutInput = {
  userId: 7,
  orderNumber: "MP-ARCHITECTURE",
  customerName: "Client Test",
  customerEmail: "client@example.com",
  shippingAddress: "27 rue du Maroc",
  shippingCity: "Paris",
  shippingPostalCode: "75019",
  shippingCountry: "France",
  lines: [{ variantId: 101, quantity: 1 }],
  requestedTotalAmount: 12_000,
  origin: "https://boutique.test",
};

function createDependencies(): OrderCheckoutDependencies {
  return {
    reserveOrder: vi.fn().mockResolvedValue({ orderId: 42, shippingCost: 0 }),
    getOrderItems: vi.fn().mockResolvedValue([
      { productName: "Vanilla Powder", sizeMl: 50, quantity: 1, unitPrice: 12_000 },
    ]),
    createCheckout: vi.fn().mockResolvedValue({ id: "cs_architecture", url: "https://checkout.test/cs_architecture" }),
    attachCheckoutSession: vi.fn().mockResolvedValue(undefined),
    releaseOrder: vi.fn().mockResolvedValue(undefined),
  };
}

describe("prepareOrderCheckout", () => {
  it("orchestre les adaptateurs sans dépendre du routeur tRPC", async () => {
    const dependencies = createDependencies();

    await expect(prepareOrderCheckout(input, dependencies)).resolves.toEqual({
      orderId: 42,
      checkoutUrl: "https://checkout.test/cs_architecture",
    });
    expect(dependencies.reserveOrder).toHaveBeenCalledWith(expect.objectContaining({
      userId: 7,
      orderNumber: "MP-ARCHITECTURE",
      lines: input.lines,
    }));
    expect(dependencies.createCheckout).toHaveBeenCalledWith(expect.objectContaining({
      orderId: 42,
      shippingCost: 0,
      origin: "https://boutique.test",
    }));
    expect(dependencies.attachCheckoutSession).toHaveBeenCalledWith(42, "cs_architecture");
    expect(dependencies.releaseOrder).not.toHaveBeenCalled();
  });

  it("bloque une adresse hors zone avant toute réservation", async () => {
    const dependencies = createDependencies();

    await expect(prepareOrderCheckout({ ...input, shippingCountry: "États-Unis", shippingPostalCode: "10001" }, dependencies))
      .rejects.toBeInstanceOf(DeliveryAddressOutOfZoneError);
    expect(dependencies.reserveOrder).not.toHaveBeenCalled();
  });

  it("libère la réservation si l’adaptateur de paiement échoue", async () => {
    const dependencies = createDependencies();
    dependencies.createCheckout = vi.fn().mockRejectedValue(new Error("Stripe indisponible"));

    await expect(prepareOrderCheckout(input, dependencies)).rejects.toBeInstanceOf(CheckoutPreparationError);
    expect(dependencies.releaseOrder).toHaveBeenCalledWith(42);
  });
});
