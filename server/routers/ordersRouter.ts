import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { notifyOwner } from "../_core/notification";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createReservedOrder,
  getAllOrders,
  getOrderById,
  getOrderItems,
  getOrderItemsByOrderIds,
  getUserOrders,
  InventoryUnavailableError,
  OrderTotalMismatchError,
  releaseExpiredStripeCheckoutOrder,
  releaseReservedOrder,
  setOrderStripeCheckoutSession,
  updateOrderStatus,
} from "../db";
import { sendOrderStatusEmail } from "../transactionalEmail";
import { requireAdmin } from "./authorization";
import { getDeliveryEligibility } from "../../shared/delivery-zones";
import { invalidateAdvisorCatalogCache } from "../advisorCatalog";
import { createStripeCheckoutSession, getStripeClient } from "../stripeCheckout";

const ORDER_STATUS = z.enum(["awaiting_payment", "pending", "paid", "processing", "shipped", "delivered", "cancelled"]);
const ORDER_INPUT = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingPostalCode: z.string().min(1),
  shippingCountry: z.string().trim().min(1).max(120),
  items: z.array(z.object({
    quantity: z.number().min(1),
    unitPrice: z.number().min(0).optional(),
    variantId: z.number().int().positive(),
  })),
  totalAmount: z.number().min(0),
});

async function getOrdersWithItems(orders: Awaited<ReturnType<typeof getUserOrders>>) {
  const orderItems = await getOrderItemsByOrderIds((orders || []).map((order) => order.id));
  const itemsByOrderId = new Map<number, typeof orderItems>();
  orderItems.forEach((item) => {
    const rows = itemsByOrderId.get(item.orderId) ?? [];
    rows.push(item);
    itemsByOrderId.set(item.orderId, rows);
  });
  return (orders || []).map((order) => ({ ...order, items: itemsByOrderId.get(order.id) ?? [] }));
}

export const ordersRouter = router({
  create: protectedProcedure.input(ORDER_INPUT).mutation(async ({ input, ctx }) => {
    if (input.items.length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Aucun article dans la commande" });
    }
    const deliveryEligibility = getDeliveryEligibility({
      country: input.shippingCountry,
      postalCode: input.shippingPostalCode,
    });
    if (!deliveryEligibility.eligible) {
      throw new TRPCError({ code: "BAD_REQUEST", message: deliveryEligibility.reason || "Cette adresse est hors zone de livraison." });
    }

    const orderNumber = `MP-${Date.now()}-${nanoid(8)}`;
    let result;
    try {
      result = await createReservedOrder({
        userId: ctx.user.id,
        orderNumber,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        shippingPostalCode: input.shippingPostalCode,
        shippingCountry: input.shippingCountry,
        lines: input.items,
        requestedTotalAmount: input.totalAmount,
      });
    } catch (error) {
      if (error instanceof InventoryUnavailableError) {
        throw new TRPCError({ code: "CONFLICT", message: error.message });
      }
      if (error instanceof OrderTotalMismatchError) {
        throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
      }
      throw error;
    }
    try {
      const origin = ctx.req.headers.origin;
      if (!origin) throw new Error("Origine du checkout introuvable");
      const checkout = await createStripeCheckoutSession({
        orderId: result.orderId,
        orderNumber,
        userId: ctx.user.id,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        shippingCost: result.shippingCost,
        lines: (await getOrderItems(result.orderId)).map((item) => ({
          productName: item.productName,
          sizeMl: item.sizeMl,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        origin,
      });
      await setOrderStripeCheckoutSession(result.orderId, checkout.id);
      invalidateAdvisorCatalogCache();
      return {
        success: true as const,
        orderNumber,
        orderId: result.orderId,
        checkoutUrl: checkout.url,
      };
    } catch (error) {
      await releaseReservedOrder(result.orderId);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Impossible de préparer le paiement sécurisé" });
    }
  }),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => getOrdersWithItems(await getUserOrders(ctx.user.id))),

  getById: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
      .query(async ({ input, ctx }) => {
      const order = await getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Commande non trouvée" });
      }
      return { ...order, items: await getOrderItems(order.id) };
    }),

  cancelPayment: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const order = await getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND", message: "Commande non trouvée" });
      if (order.status !== "awaiting_payment" || !order.stripeCheckoutSessionId) return { released: false as const };

      try {
        await getStripeClient().checkout.sessions.expire(order.stripeCheckoutSessionId);
      } catch (error) {
        throw new TRPCError({ code: "CONFLICT", message: "Cette session de paiement ne peut plus être annulée" });
      }
      const released = await releaseExpiredStripeCheckoutOrder(order.stripeCheckoutSessionId);
      return { released: released.released };
    }),

  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user);
    return getOrdersWithItems(await getAllOrders());
  }),

  updateStatus: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive(), status: ORDER_STATUS }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user);
      const order = await getOrderById(input.orderId);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Commande non trouvée" });

      await updateOrderStatus(input.orderId, input.status);

      try {
        await notifyOwner({
          title: `📦 Mise à jour de commande: ${order.orderNumber}`,
          content: `Statut: ${input.status}\nClient: ${order.customerEmail}`,
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
      }

      if (order.status !== input.status) {
        try {
          await sendOrderStatusEmail({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            status: input.status,
          });
        } catch (error) {
          console.error("Erreur lors de l’envoi d’email de statut:", error);
        }
      }

      return { success: true } as const;
    }),
});
