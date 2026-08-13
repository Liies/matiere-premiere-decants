import { TRPCError } from "@trpc/server";

export type RoleBearer = { role: string };

/** Garde applicative commune aux capacités réservées à l’administration. */
export function requireAdmin(user: RoleBearer) {
  if (user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès refusé" });
  }
}
