import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createVerifiedProductReview,
  getPendingProductReviews,
  getPublishedProductReviews,
  getReviewEligibility,
  moderateProductReview,
} from "../db";

const PRODUCT_ID_INPUT = z.object({ productId: z.number().int().positive() });

const REVIEW_INPUT = PRODUCT_ID_INPUT.extend({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(140).optional(),
  body: z.string().trim().min(20, "Votre avis doit comporter au moins 20 caractères").max(2_000),
});

export const reviewsRouter = router({
  listPublished: publicProcedure.input(PRODUCT_ID_INPUT).query(({ input }) =>
    getPublishedProductReviews(input.productId),
  ),

  eligibility: protectedProcedure.input(PRODUCT_ID_INPUT).query(async ({ ctx, input }) => {
    const result = await getReviewEligibility(ctx.user.id, input.productId);
    return {
      canSubmit: Boolean(result.eligibleOrderId) && !result.existingReview,
      existingStatus: result.existingReview?.status ?? null,
    };
  }),

  create: protectedProcedure.input(REVIEW_INPUT).mutation(async ({ ctx, input }) => {
    try {
      const reviewId = await createVerifiedProductReview({ ...input, userId: ctx.user.id });
      return { id: reviewId, status: "pending" as const };
    } catch (error) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: error instanceof Error ? error.message : "Impossible de déposer cet avis",
      });
    }
  }),

  pending: adminProcedure.query(() => getPendingProductReviews()),

  moderate: adminProcedure
    .input(z.object({ id: z.number().int().positive(), status: z.enum(["published", "rejected"]) }))
    .mutation(async ({ input }) => {
      await moderateProductReview(input.id, input.status);
      return { success: true } as const;
    }),
});
