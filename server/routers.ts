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
  syncGuestCartToUserCart,
  createReservedOrder,
  InventoryUnavailableError,
  addCartVariant,
  createCatalogVariant,
  getBrands,
  getCatalogProducts,
  getProductByBrandSlug,
  getProductVariants,
  recordSourceBottle,
} from "./db";
import { nanoid } from "nanoid";
import { notifyOwner } from "./_core/notification";
import { contactMessageSchema, CONTACT_SUBJECT_LABELS } from "@shared/contact";
import { sendOrderCreatedEmails, sendOrderStatusEmail } from "./transactionalEmail";
import { TRPCError } from "@trpc/server";

const ORDER_STATUS = z.enum(["awaiting_payment", "pending", "paid", "processing", "shipped", "delivered", "cancelled"]);
const PRODUCT_CATALOG_UPDATE = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(2, "Le nom doit comporter au moins 2 caractères").max(255),
  description: z.string().trim().min(10, "La description doit comporter au moins 10 caractères").max(4000),
  price: z.number().int().min(100, "Le prix doit être d’au moins 1,00 €").max(1_000_000),
  volumeMl: z.number().int().min(1, "La contenance doit être supérieure à 0 ml").max(1_000),
});

const INVENTORY_VARIANT_INPUT = z.object({
  productId: z.number().int().positive(),
  sizeMl: z.number().int().min(1).max(100),
  sku: z.string().trim().min(3).max(64).regex(/^[A-Z0-9-]+$/, "Le SKU doit utiliser uniquement A-Z, 0-9 et -"),
  priceCents: z.number().int().min(100).max(1_000_000),
});

const SOURCE_BOTTLE_INPUT = z.object({
  productId: z.number().int().positive(),
  batchRef: z.string().trim().min(1).max(64).optional(),
  capacityMl: z.number().int().min(1).max(1_000),
  remainingMl: z.number().positive().max(1_000),
  purchasePriceCents: z.number().int().min(0).max(10_000_000),
  purchasedAt: z.date().optional(),
});

function requireAdmin(user: { role: string }) {
  if (user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès refusé" });
  }
}

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
      const catalog = await getCatalogProducts();
      return catalog.map(({ product, brand }) => ({ ...product, brand }));
    }),

    brands: publicProcedure.query(async () => getBrands()),

    getByBrandSlug: publicProcedure
      .input(z.object({ brand: z.string().trim().min(1).max(120), slug: z.string().trim().min(1).max(255) }))
      .query(async ({ input }) => getProductByBrandSlug(input.brand, input.slug)),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        return product;
      }),
  }),

  adminCatalog: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      requireAdmin(ctx.user);
      return getAllProducts();
    }),

    update: protectedProcedure
      .input(PRODUCT_CATALOG_UPDATE)
      .mutation(async ({ input, ctx }) => {
        requireAdmin(ctx.user);

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

  adminInventory: router({
    variants: protectedProcedure
      .input(z.object({ productId: z.number().int().positive() }))
      .query(async ({ input, ctx }) => {
        requireAdmin(ctx.user);
        return getProductVariants(input.productId);
      }),

    createVariant: protectedProcedure
      .input(INVENTORY_VARIANT_INPUT)
      .mutation(async ({ input, ctx }) => {
        requireAdmin(ctx.user);
        const product = await getProductById(input.productId);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Parfum introuvable" });
        await createCatalogVariant(input);
        return { success: true } as const;
      }),

    recordSourceBottle: protectedProcedure
      .input(SOURCE_BOTTLE_INPUT)
      .mutation(async ({ input, ctx }) => {
        requireAdmin(ctx.user);
        const product = await getProductById(input.productId);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Parfum introuvable" });
        await recordSourceBottle({ ...input, remainingMl: input.remainingMl.toFixed(2) });
        return { success: true } as const;
      }),
  }),

  // Cart procedures
  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      const items = await getCartItems(ctx.user.id);
      
      // Enrichir les articles avec le produit et, le cas échéant, le format réellement choisi.
      const enrichedItems = await Promise.all(
        (items || []).map(async (item) => {
          const product = await getProductById(item.productId);
          const variant = item.variantId && product
            ? (await getProductVariants(product.id)).find((candidate) => candidate.id === item.variantId) ?? null
            : null;
          return {
            ...item,
            product,
            variant,
          };
        })
      );
      
      return enrichedItems;
    }),

    syncGuestCart: protectedProcedure
      .input(z.object({
        syncKey: z.string().min(12).max(128),
        items: z.array(z.object({
          productId: z.number().int().positive(),
          quantity: z.number().int().min(1).max(100),
        })).min(1).max(100),
      }))
      .mutation(async ({ input, ctx }) => {
        return syncGuestCartToUserCart(ctx.user.id, input.syncKey, input.items);
      }),

    addItem: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ input, ctx }) => {
        // Valider que le produit existe
        const product = await getProductById(input.productId);
        if (!product) {
          throw new Error("Produit non trouvé");
        }

        const currentItems = await getCartItems(ctx.user.id);
        const currentQuantity = (currentItems || [])
          .filter((item) => item.productId === input.productId)
          .reduce((total, item) => total + item.quantity, 0);

        // Valider le stock avec la quantité déjà présente dans le panier compte.
        if (product.stock < currentQuantity + input.quantity) {
          throw new Error("Stock insuffisant");
        }

        await addCartItem(ctx.user.id, input.productId, input.quantity);
        return { success: true };
      }),

    addVariant: protectedProcedure
      .input(z.object({ productId: z.number().int().positive(), variantId: z.number().int().positive(), quantity: z.number().int().min(1).max(100) }))
      .mutation(async ({ input, ctx }) => {
        const variant = (await getProductVariants(input.productId)).find((item) => item.id === input.variantId);
        const currentItems = await getCartItems(ctx.user.id);
        const currentQuantity = currentItems
          .filter((item) => item.variantId === input.variantId)
          .reduce((total, item) => total + item.quantity, 0);
        if (!variant || variant.availableQuantity < currentQuantity + input.quantity) {
          throw new TRPCError({ code: "CONFLICT", message: "Stock insuffisant pour ce format" });
        }
        await addCartVariant(ctx.user.id, input.productId, input.variantId, input.quantity);
        return { success: true } as const;
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

        if (cartItem.variantId) {
          const variant = (await getProductVariants(cartItem.productId)).find((candidate) => candidate.id === cartItem.variantId);
          if (!variant || variant.availableQuantity < input.quantity) {
            throw new TRPCError({ code: "CONFLICT", message: "Stock insuffisant pour ce format" });
          }
          await updateCartItemQuantity(input.cartItemId, input.quantity);
          return { success: true } as const;
        }

        // Compatibilité pour les lignes historiques au niveau produit.
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
              unitPrice: z.number().min(0).optional(),
              variantId: z.number().int().positive().optional(),
            })
          ),
          totalAmount: z.number().min(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (input.items.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Aucun article dans la commande" });
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
          });
        } catch (error) {
          if (error instanceof InventoryUnavailableError) {
            throw new TRPCError({ code: "CONFLICT", message: error.message });
          }
          throw error;
        }

        // Envoyer une notification au propriétaire
        try {
          await notifyOwner({
            title: `🎉 Nouvelle commande: ${orderNumber}`,
            content: `Commande de ${input.customerName} (${input.customerEmail})\nMontant: €${(result.totalAmount / 100).toFixed(2)}\nAdresse: ${input.shippingAddress}, ${input.shippingPostalCode} ${input.shippingCity}, ${input.shippingCountry}`,
          });
        } catch (error) {
          console.error("Erreur lors de l'envoi de la notification:", error);
          // Ne pas échouer la commande si la notification échoue
        }

        try {
          const emailResults = await sendOrderCreatedEmails({
            orderNumber,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            totalAmount: result.totalAmount,
            items: result.items,
          });
          emailResults
            .filter((result) => result.status === "rejected")
            .forEach((result) => console.error("Erreur lors de l’envoi d’email de commande:", result.reason));
        } catch (error) {
          console.error("Erreur lors de la préparation des emails de commande:", error);
        }

        return {
          success: true,
          orderNumber,
          orderId: result.orderId,
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
      requireAdmin(ctx.user);

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
        requireAdmin(ctx.user);

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

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
