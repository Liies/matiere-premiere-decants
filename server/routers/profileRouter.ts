import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSavedDeliveryAddress, saveDeliveryAddress } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { getDeliveryEligibility } from "../../shared/delivery-zones";

const DELIVERY_ADDRESS_INPUT = z.object({
  address: z.string().trim().min(3).max(500),
  city: z.string().trim().min(2).max(255),
  postalCode: z.string().trim().min(2).max(20),
  country: z.string().trim().min(2).max(120),
});

export const profileRouter = router({
  getDeliveryAddress: protectedProcedure.query(({ ctx }) => getSavedDeliveryAddress(ctx.user.id)),

  saveDeliveryAddress: protectedProcedure.input(DELIVERY_ADDRESS_INPUT).mutation(async ({ input, ctx }) => {
    const eligibility = getDeliveryEligibility({ country: input.country, postalCode: input.postalCode });
    if (!eligibility.eligible) {
      throw new TRPCError({ code: "BAD_REQUEST", message: eligibility.reason || "Cette adresse est hors zone de livraison." });
    }
    await saveDeliveryAddress(ctx.user.id, input);
    return { success: true } as const;
  }),
});
