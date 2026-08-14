import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  addCartVariant,
  clearUserCart,
  getCartItems,
  getCartItemsWithDetails,
  getProductVariants,
  getVariantById,
  removeCartItem,
  syncGuestCartToUserCart,
  updateCartItemQuantity,
} from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import {
  canAddToCart,
  getVariantQuantityInCart,
  hasSufficientStock,
} from "../../shared/cart-domain";

const CART_ITEM_INPUT = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(100),
});
const CART_VARIANT_INPUT = z.object({
  variantId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(100),
});
const CART_SYNC_ITEM_INPUT = CART_VARIANT_INPUT.extend({
  productId: z.number().int().positive(),
});

export const cartRouter = router({
  getItems: protectedProcedure.query(async ({ ctx }) => {
    return getCartItemsWithDetails(ctx.user.id);
  }),

  syncGuestCart: protectedProcedure
    .input(z.object({
      syncKey: z.string().min(12).max(128),
      items: z.array(CART_SYNC_ITEM_INPUT).min(1).max(100),
    }))
    .mutation(({ input, ctx }) => syncGuestCartToUserCart(ctx.user.id, input.syncKey, input.items)),

  addItem: protectedProcedure
    .input(CART_ITEM_INPUT)
    .mutation(() => {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Choisissez une contenance avant d’ajouter un parfum au panier.",
      });
    }),

  addVariant: protectedProcedure
    .input(CART_VARIANT_INPUT)
    .mutation(async ({ input, ctx }) => {
      const variant = await getVariantById(input.variantId);
      const currentItems = await getCartItems(ctx.user.id);
      const currentQuantity = getVariantQuantityInCart(currentItems || [], input.variantId);
      if (!variant || !variant.isActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Format de décant introuvable" });
      }
      if (!canAddToCart(variant.stock, currentQuantity, input.quantity)) {
        throw new TRPCError({ code: "CONFLICT", message: "Stock insuffisant pour ce format" });
      }

      await addCartVariant(ctx.user.id, variant.productId, input.variantId, input.quantity);
      return { success: true } as const;
    }),

  updateQuantity: protectedProcedure
    .input(z.object({ cartItemId: z.number().int().positive(), quantity: z.number().int().min(1).max(100) }))
    .mutation(async ({ input, ctx }) => {
      const items = await getCartItems(ctx.user.id);
      const cartItem = items?.find((item) => item.id === input.cartItemId);
      if (!cartItem) throw new TRPCError({ code: "NOT_FOUND", message: "Article du panier non trouvé" });

      const productVariants = await getProductVariants(cartItem.productId);
      const variant = productVariants.find((candidate) => candidate.id === cartItem.variantId);
      if (!variant || !hasSufficientStock(variant.stock, input.quantity)) {
        throw new TRPCError({ code: "CONFLICT", message: "Stock insuffisant pour ce format" });
      }

      await updateCartItemQuantity(input.cartItemId, input.quantity);
      return { success: true } as const;
    }),

  removeItem: protectedProcedure
    .input(z.object({ cartItemId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const items = await getCartItems(ctx.user.id);
      const cartItem = items?.find((item) => item.id === input.cartItemId);
      if (!cartItem) throw new TRPCError({ code: "NOT_FOUND", message: "Article du panier non trouvé" });

      await removeCartItem(input.cartItemId);
      return { success: true } as const;
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    await clearUserCart(ctx.user.id);
    return { success: true } as const;
  }),
});
