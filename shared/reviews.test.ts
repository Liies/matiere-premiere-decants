import { describe, expect, it } from "vitest";
import { isEligibleReviewOrderStatus } from "./reviews";

describe("éligibilité des avis vérifiés", () => {
  it.each(["paid", "processing", "shipped", "delivered"])("autorise une commande au statut %s", (status) => {
    expect(isEligibleReviewOrderStatus(status)).toBe(true);
  });

  it.each(["awaiting_payment", "pending", "cancelled", "unknown"])("refuse une commande au statut %s", (status) => {
    expect(isEligibleReviewOrderStatus(status)).toBe(false);
  });
});
