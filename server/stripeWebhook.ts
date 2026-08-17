import type { Express, Request, Response } from "express";
import express from "express";
import type Stripe from "stripe";
import { notifyOwner } from "./_core/notification";
import { markStripeCheckoutOrderPaid, releaseExpiredStripeCheckoutOrder } from "./db";
import { sendOrderCreatedEmails } from "./transactionalEmail";
import { getStripeClient } from "./stripeCheckout";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;
  const orderId = Number(session.metadata?.order_id);
  if (!Number.isInteger(orderId) || orderId <= 0) throw new Error("Session Stripe sans identifiant de commande valide");

  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
  const result = await markStripeCheckoutOrderPaid({
    orderId,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
  });
  if (!result.changed) return;

  await Promise.allSettled([
    notifyOwner({
      title: `Paiement reçu : ${result.order.orderNumber}`,
      content: `Commande ${result.order.orderNumber}\nClient : ${result.order.customerName} (${result.order.customerEmail})\nMontant : ${(result.order.totalAmount / 100).toFixed(2)} €`,
    }),
    sendOrderCreatedEmails({
      orderNumber: result.order.orderNumber,
      customerName: result.order.customerName,
      customerEmail: result.order.customerEmail,
      totalAmount: result.order.totalAmount,
      items: result.items.map((item) => ({ productName: item.productName, quantity: item.quantity, unitPrice: item.unitPrice })),
    }),
  ]);
}

export async function processStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "checkout.session.expired":
      await releaseExpiredStripeCheckoutOrder((event.data.object as Stripe.Checkout.Session).id);
      break;
    default:
      break;
  }
}

export function registerStripeWebhook(app: Express) {
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (typeof signature !== "string" || !webhookSecret) {
      return res.status(400).json({ error: "Signature Stripe manquante" });
    }

    try {
      const event = getStripeClient().webhooks.constructEvent(req.body, signature, webhookSecret);
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      await processStripeWebhookEvent(event);
      return res.json({ received: true });
    } catch (error) {
      console.error("[Stripe webhook] Échec de vérification ou de traitement", error);
      return res.status(400).json({ error: "Webhook Stripe invalide" });
    }
  });
}
