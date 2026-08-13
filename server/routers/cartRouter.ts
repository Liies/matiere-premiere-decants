import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  addCartItem,
  addCartVariant,
  clearUserCart,
  getCartItems,
  getProductById,
  getProductVariants,
  removeCartItem,
  syncGuestCartToUserCart,
  updateCartItemQuantity,
} from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import {
  canAddToCart,
  getProductQuantityInCart,
  getVariantQuantityInCart,
  hasSufficientStock,
} from "../../shared/cart-domain";

const CART_ITEM_INPUT = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(100),
});

export const cartRouter = router({
  getItems: protectedProcedure.query(async ({ ctx }) => {
    const items = await getCartItems(ctx.user.id);

    return Promise.all(
      (items || []).map(async (item) => {
        const product = await getProductById(item.productId);
        const variant = item.variantId && product
          ? (await getProductVariants(product.id)).find((candidate) => candidate.id === item.variantId) ?? null
          : null;

        return { ...item, product, variant };
      }),
    );
  }),

  syncGuestCart: protectedProcedure
    .input(z.object({
      syncKey: z.string().min(12).max(128),
      items: z.array(CART_ITEM_INPUT).min(1).max(100),
    }))
    .mutation(({ input, ctx }) => syncGuestCartToUserCart(ctx.user.id, input.syncKey, input.items)),

  addItem: protectedProcedure
    .input(CART_ITEM_INPUT)
    .mutation(async ({ input, ctx }) => {
      const product = await getProductById(input.productId);
      if (!product) throw new Error("Produit non trouvé");

      const currentItems = await getCartItems(ctx.user.id);
      const currentQuantity = getProductQuantityInCart(currentItems || [], input.productId);
      if (!canAddToCart(product.stock, currentQuantity, input.quantity)) {
        throw new Error("Stock insuffisant");
      }

      await addCartItem(ctx.user.id, input.productId, input.quantity);
      return { success: true } as const;
    }),

  addVariant: protectedProcedure
    .input(z.object({ ...CART_ITEM_INPUT.shape, variantId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const variant = (await getProductVariants(input.productId)).find((item) => item.id === input.variantId);
      const currentItems = await getCartItems(ctx.user.id);
      const currentQuantity = getVariantQuantityInCart(currentItems || [], input.variantId);
      if (!variant || !canAddToCart(variant.availableQuantity, currentQuantity, input.quantity)) {
        throw new TRPCError({ code: "CONFLICT", message: "Stock insuffisant pour ce format" });
      }

      await addCartVariant(ctx.user.id, input.productId, input.variantId, input.quantity);
      return { success: true } as const;
    }),

  updateQuantity: protectedProcedure
    .input(z.object({ cartItemId: z.number().int().positive(), quantity: z.number().int().min(1).max(100) }))
    .mutation(async ({ input, ctx }) => {
      const items = await getCartItems(ctx.user.id);
      const cartItem = items?.find((item) => item.id === input.cartItemId);
      if (!cartItem) throw new Error("Article du panier non trouvé");

      if (cartItem.variantId) {
        const variant = (await getProductVariants(cartItem.productId)).find((candidate) => candidate.id === cartItem.variantId);
        if (!variant || !hasSufficientStock(variant.availableQuantity, input.quantity)) {
          throw new TRPCError({ code: "CONFLICT", message: "Stock insuffisant pour ce format" });
        }
      } else {
        const product = await getProductById(cartItem.productId);
        if (!product || !hasSufficientStock(product.stock, input.quantity)) {
          throw new Error("Stock insuffisant");
        }
      }

      await updateCartItemQuantity(input.cartItemId, input.quantity);
      return { success: true } as const;
    }),

  removeItem: protectedProcedure
    .input(z.object({ cartItemId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const items = await getCartItems(ctx.user.id);
      const cartItem = items?.find((item) => item.id === input.cartItemId);
      if (!cartItem) throw new Error("Article du panier non trouvé");

      await removeCartItem(input.cartItemId);
      return { success: true } as const;
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    await clearUserCart(ctx.user.id);
    return { success: true } as const;
  }),
});
