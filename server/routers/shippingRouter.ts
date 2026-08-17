import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { calculateShipping } from "../../shared/shipping";

export const shippingRouter = router({
  calculate: publicProcedure
    .input(
      z.object({
        country: z.string().min(1),
        postalCode: z.string().optional(),
        subtotalCents: z.number().int().min(0),
      })
    )
    .query(({ input }) => {
      return calculateShipping(input.country, input.subtotalCents, input.postalCode);
    }),
});
