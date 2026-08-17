import Stripe from "stripe";

type CheckoutLine = {
  productName: string;
  sizeMl: number | null;
  quantity: number;
  unitPrice: number;
};

type CreateStripeCheckoutInput = {
  orderId: number;
  orderNumber: string;
  userId: number;
  customerEmail: string;
  customerName: string;
  shippingCost: number;
  lines: CheckoutLine[];
  origin: string;
};

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Le paiement Stripe n’est pas configuré");
  return new Stripe(secretKey);
}

export async function createStripeCheckoutSession(input: CreateStripeCheckoutInput) {
  const stripe = getStripeClient();
  const orderReference = input.orderNumber;
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = input.lines.map((line) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: `${line.productName}${line.sizeMl ? ` · ${line.sizeMl} ml` : ""}`,
      },
      unit_amount: line.unitPrice,
    },
    quantity: line.quantity,
  }));

  if (input.shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: "Livraison Colissimo" },
        unit_amount: input.shippingCost,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.customerEmail,
    client_reference_id: input.userId.toString(),
    allow_promotion_codes: true,
    line_items: lineItems,
    success_url: `${input.origin}/checkout?payment=success&order_id=${input.orderId}`,
    cancel_url: `${input.origin}/checkout?payment=cancelled&order_id=${input.orderId}`,
    metadata: {
      order_id: input.orderId.toString(),
      order_number: input.orderNumber,
      user_id: input.userId.toString(),
      customer_email: input.customerEmail,
      customer_name: input.customerName,
    },
    payment_intent_data: {
      metadata: {
        order_id: input.orderId.toString(),
        order_number: input.orderNumber,
        user_id: input.userId.toString(),
      },
    },
  });

  if (!session.url) throw new Error(`La session de paiement ${orderReference} ne contient pas d’URL`);
  return { id: session.id, url: session.url };
}
