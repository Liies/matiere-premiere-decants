import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllProducts,
  getProductById,
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearUserCart,
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  createOrderItem,
  getOrderItems,
  getOrderById,
  updateProductCatalog,
} from "./db";
import { nanoid } from "nanoid";
import { notifyOwner } from "./_core/notification";
import { contactMessageSchema, CONTACT_SUBJECT_LABELS } from "@shared/contact";

const ORDER_STATUS = z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]);
const PRODUCT_CATALOG_UPDATE = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(2, "Le nom doit comporter au moins 2 caractères").max(255),
  description: z.string().trim().min(10, "La description doit comporter au moins 10 caractères").max(4000),
  price: z.number().int().min(100, "Le prix doit être d’au moins 1,00 €").max(1_000_000),
  volumeMl: z.number().int().min(1, "La contenance doit être supérieure à 0 ml").max(1_000),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products procedures
  contact: router({
    submit: publicProcedure
      .input(contactMessageSchema)
      .mutation(async ({ input }) => {
        const notificationSent = await notifyOwner({
          title: `Nouveau message de contact — ${CONTACT_SUBJECT_LABELS[input.subject]}`,
          content: [
            `Nom : ${input.name}`,
            `Email : ${input.email}`,
            `Sujet : ${CONTACT_SUBJECT_LABELS[input.subject]}`,
            "",
            input.message,
          ].join("\n"),
        });

        if (!notificationSent) {
          throw new Error("Le message n’a pas pu être transmis. Veuillez réessayer.");
        }

        return { success: true } as const;
      }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const products = await getAllProducts();
      return products || [];
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        return product;
      }),
  }),

  adminCatalog: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }
      return getAllProducts();
    }),

    update: protectedProcedure
      .input(PRODUCT_CATALOG_UPDATE)
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Accès refusé");
        }

        const product = await getProductById(input.id);
        if (!product) {
          throw new Error("Produit non trouvé");
        }

        await updateProductCatalog(input.id, {
          name: input.name,
          description: input.description,
          price: input.price,
          volumeMl: input.volumeMl,
        });

        return { success: true } as const;
      }),
  }),

  // Cart procedures
  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      const items = await getCartItems(ctx.user.id);
      
      // Enrichir les articles du panier avec les détails du produit
      const enrichedItems = await Promise.all(
        (items || []).map(async (item) => {
          const product = await getProductById(item.productId);
          return {
            ...item,
            product,
          };
        })
      );
      
      return enrichedItems;
    }),

    addItem: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ input, ctx }) => {
        // Valider que le produit existe
        const product = await getProductById(input.productId);
        if (!product) {
          throw new Error("Produit non trouvé");
        }

        // Valider le stock
        if (product.stock < input.quantity) {
          throw new Error("Stock insuffisant");
        }

        await addCartItem(ctx.user.id, input.productId, input.quantity);
        return { success: true };
      }),

    updateQuantity: protectedProcedure
      .input(z.object({ cartItemId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ input, ctx }) => {
        // Vérifier que l'article appartient à l'utilisateur
        const items = await getCartItems(ctx.user.id);
        const cartItem = items?.find(item => item.id === input.cartItemId);
        
        if (!cartItem) {
          throw new Error("Article du panier non trouvé");
        }

        // Valider le stock
        const product = await getProductById(cartItem.productId);
        if (!product || product.stock < input.quantity) {
          throw new Error("Stock insuffisant");
        }

        await updateCartItemQuantity(input.cartItemId, input.quantity);
        return { success: true };
      }),

    removeItem: protectedProcedure
      .input(z.object({ cartItemId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Vérifier que l'article appartient à l'utilisateur
        const items = await getCartItems(ctx.user.id);
        const cartItem = items?.find(item => item.id === input.cartItemId);
        
        if (!cartItem) {
          throw new Error("Article du panier non trouvé");
        }

        await removeCartItem(input.cartItemId);
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await clearUserCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // Orders procedures
  orders: router({
    create: protectedProcedure
      .input(
        z.object({
          customerName: z.string().min(1),
          customerEmail: z.string().email(),
          shippingAddress: z.string().min(1),
          shippingCity: z.string().min(1),
          shippingPostalCode: z.string().min(1),
          shippingCountry: z.string().min(1),
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number().min(1),
              unitPrice: z.number().min(0),
            })
          ),
          totalAmount: z.number().min(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Valider que les articles ne sont pas vides
        if (!input.items || input.items.length === 0) {
          throw new Error("Aucun article dans la commande");
        }

        // Valider et recalculer les prix serveur
        let serverTotalAmount = 0;
        for (const item of input.items) {
          const product = await getProductById(item.productId);
          if (!product) {
            throw new Error(`Produit ${item.productId} non trouvé`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Stock insuffisant pour ${product.name}`);
          }

          // Recalculer le prix serveur (sécurité)
          serverTotalAmount += product.price * item.quantity;
        }

        // Vérifier que le montant correspond
        if (serverTotalAmount !== input.totalAmount) {
          throw new Error("Montant invalide - veuillez rafraîchir votre panier");
        }

        const orderNumber = `MP-${Date.now()}-${nanoid(8)}`;

        // Créer la commande
        const result = await createOrder({
          userId: ctx.user.id,
          orderNumber,
          status: "pending",
          totalAmount: input.totalAmount,
          customerEmail: input.customerEmail,
          customerName: input.customerName,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingPostalCode: input.shippingPostalCode,
          shippingCountry: input.shippingCountry,
        });

        // Créer les articles de la commande
        for (const item of input.items) {
          const product = await getProductById(item.productId);
          await createOrderItem({
            orderId: (result as any).insertId,
            productId: item.productId,
            productName: product?.name || "Produit inconnu",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          });
        }

        // Vider le panier
        await clearUserCart(ctx.user.id);

        // Envoyer une notification au propriétaire
        try {
          await notifyOwner({
            title: `🎉 Nouvelle commande: ${orderNumber}`,
            content: `Commande de ${input.customerName} (${input.customerEmail})\nMontant: €${(input.totalAmount / 100).toFixed(2)}\nAdresse: ${input.shippingAddress}, ${input.shippingPostalCode} ${input.shippingCity}, ${input.shippingCountry}`,
          });
        } catch (error) {
          console.error("Erreur lors de l'envoi de la notification:", error);
          // Ne pas échouer la commande si la notification échoue
        }

        return {
          success: true,
          orderNumber,
          orderId: (result as any).insertId,
        };
      }),

    getMyOrders: protectedProcedure.query(async ({ ctx }) => {
      const orders = await getUserOrders(ctx.user.id);
      
      // Enrichir les commandes avec les articles
      const enrichedOrders = await Promise.all(
        (orders || []).map(async (order) => {
          const items = await getOrderItems(order.id);
          return {
            ...order,
            items,
          };
        })
      );
      
      return enrichedOrders;
    }),

    getById: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await getOrderById(input.orderId);
        
        if (!order || order.userId !== ctx.user.id) {
          throw new Error("Commande non trouvée");
        }

        const items = await getOrderItems(order.id);
        return {
          ...order,
          items,
        };
      }),

    // Admin procedures
    getAllOrders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      const orders = await getAllOrders();
      
      // Enrichir les commandes avec les articles
      const enrichedOrders = await Promise.all(
        (orders || []).map(async (order) => {
          const items = await getOrderItems(order.id);
          return {
            ...order,
            items,
          };
        })
      );
      
      return enrichedOrders;
    }),

    updateStatus: protectedProcedure
      .input(z.object({ orderId: z.number(), status: ORDER_STATUS }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Accès refusé");
        }

        const order = await getOrderById(input.orderId);
        if (!order) {
          throw new Error("Commande non trouvée");
        }

        await updateOrderStatus(input.orderId, input.status);

        // Envoyer une notification au propriétaire
        try {
          await notifyOwner({
            title: `📦 Mise à jour de commande: ${order.orderNumber}`,
            content: `Statut: ${input.status}\nClient: ${order.customerEmail}`,
          });
        } catch (error) {
          console.error("Erreur lors de l'envoi de la notification:", error);
        }

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
