import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createCatalogVariant,
  getAllProducts,
  getBrands,
  getCatalogProducts,
  getProductByBrandSlug,
  getProductById,
  getProductVariants,
  getVariantsByProductIds,
  recordSourceBottle,
  updateProductCatalog,
} from "./db";
import { contactMessageSchema, CONTACT_SUBJECT_LABELS } from "@shared/contact";
import { requireAdmin } from "./routers/authorization";
import { cartRouter } from "./routers/cartRouter";
import { ordersRouter } from "./routers/ordersRouter";
import { profileRouter } from "./routers/profileRouter";

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

/**
 * Composition root tRPC : cette couche ne contient que l’assemblage des
 * capacités. Les règles de panier et les flux de commande vivent dans leurs
 * modules dédiés.
 */
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure.input(contactMessageSchema).mutation(async ({ input }) => {
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
      if (!notificationSent) throw new Error("Le message n’a pas pu être transmis. Veuillez réessayer.");
      return { success: true } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const catalog = await getCatalogProducts();
      const allVariants = await getVariantsByProductIds(catalog.map(({ product }) => product.id));
      const variantsByProductId = new Map<number, typeof allVariants>();
      allVariants.filter((variant) => variant.isActive).forEach((variant) => {
        const rows = variantsByProductId.get(variant.productId) ?? [];
        rows.push(variant);
        variantsByProductId.set(variant.productId, rows);
      });
      const catalogWithVariants = catalog.map(({ product, brand }) => ({
        ...product,
        brand,
        variants: variantsByProductId.get(product.id) ?? [],
      }));
      return catalogWithVariants.filter((product) => product.variants.length > 0);
    }),
    brands: publicProcedure.query(() => getBrands()),
    getByBrandSlug: publicProcedure
      .input(z.object({ brand: z.string().trim().min(1).max(120), slug: z.string().trim().min(1).max(255) }))
      .query(({ input }) => getProductByBrandSlug(input.brand, input.slug)),
    getById: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        return product ? { ...product, variants: await getProductVariants(product.id) } : undefined;
      }),
  }),

  adminCatalog: router({
    list: protectedProcedure.query(({ ctx }) => {
      requireAdmin(ctx.user);
      return getAllProducts();
    }),
    update: protectedProcedure.input(PRODUCT_CATALOG_UPDATE).mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user);
      const product = await getProductById(input.id);
      if (!product) throw new Error("Produit non trouvé");
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
      .query(({ input, ctx }) => {
        requireAdmin(ctx.user);
        return getProductVariants(input.productId);
      }),
    createVariant: protectedProcedure.input(INVENTORY_VARIANT_INPUT).mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user);
      const product = await getProductById(input.productId);
      if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Parfum introuvable" });
      await createCatalogVariant(input);
      return { success: true } as const;
    }),
    recordSourceBottle: protectedProcedure.input(SOURCE_BOTTLE_INPUT).mutation(async ({ input, ctx }) => {
      requireAdmin(ctx.user);
      const product = await getProductById(input.productId);
      if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Parfum introuvable" });
      await recordSourceBottle({ ...input, remainingMl: input.remainingMl.toFixed(2) });
      return { success: true } as const;
    }),
  }),

  cart: cartRouter,
  orders: ordersRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
