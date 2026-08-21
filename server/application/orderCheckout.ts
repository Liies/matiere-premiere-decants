import { getDeliveryEligibility } from "@shared/delivery-zones";
import type { RequestedOrderLine } from "@shared/inventory";

export type CheckoutOrderItem = {
  productName: string;
  sizeMl: number | null;
  quantity: number;
  unitPrice: number;
};

export type ReservedOrder = {
  orderId: number;
  shippingCost: number;
};

export type CreateOrderCheckoutInput = {
  userId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  lines: RequestedOrderLine[];
  requestedTotalAmount: number;
  origin?: string;
};

export type OrderCheckoutDependencies = {
  reserveOrder: (input: Omit<CreateOrderCheckoutInput, "origin">) => Promise<ReservedOrder>;
  getOrderItems: (orderId: number) => Promise<CheckoutOrderItem[]>;
  createCheckout: (input: {
    orderId: number;
    orderNumber: string;
    userId: number;
    customerEmail: string;
    customerName: string;
    shippingCost: number;
    lines: CheckoutOrderItem[];
    origin: string;
  }) => Promise<{ id: string; url: string }>;
  attachCheckoutSession: (orderId: number, checkoutSessionId: string) => Promise<void>;
  releaseOrder: (orderId: number) => Promise<unknown>;
};

export class DeliveryAddressOutOfZoneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeliveryAddressOutOfZoneError";
  }
}

export class CheckoutPreparationError extends Error {
  constructor() {
    super("Impossible de préparer le paiement sécurisé");
    this.name = "CheckoutPreparationError";
  }
}

/**
 * Cas d’usage applicatif : valide une adresse, réserve les références, puis prépare
 * une session de paiement. Les adaptateurs de persistance et de paiement sont injectés.
 */
export async function prepareOrderCheckout(
  input: CreateOrderCheckoutInput,
  dependencies: OrderCheckoutDependencies,
) {
  const deliveryEligibility = getDeliveryEligibility({
    country: input.shippingCountry,
    postalCode: input.shippingPostalCode,
  });
  if (!deliveryEligibility.eligible) {
    throw new DeliveryAddressOutOfZoneError(
      deliveryEligibility.reason || "Cette adresse est hors zone de livraison.",
    );
  }
  if (!input.origin) {
    throw new CheckoutPreparationError();
  }

  const { origin, ...reservationInput } = input;
  const reservedOrder = await dependencies.reserveOrder(reservationInput);

  try {
    const lines = await dependencies.getOrderItems(reservedOrder.orderId);
    const checkout = await dependencies.createCheckout({
      orderId: reservedOrder.orderId,
      orderNumber: input.orderNumber,
      userId: input.userId,
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      shippingCost: reservedOrder.shippingCost,
      lines,
      origin,
    });
    await dependencies.attachCheckoutSession(reservedOrder.orderId, checkout.id);

    return {
      orderId: reservedOrder.orderId,
      checkoutUrl: checkout.url,
    };
  } catch {
    await dependencies.releaseOrder(reservedOrder.orderId);
    throw new CheckoutPreparationError();
  }
}
