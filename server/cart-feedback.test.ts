import { describe, expect, it } from "vitest";
import {
  CART_CONFIRMATION_DURATION_MS,
  getCartConfirmationLabel,
} from "../shared/cart-feedback";

describe("confirmation d’ajout au panier", () => {
  it("présente un libellé explicite pendant la confirmation", () => {
    expect(getCartConfirmationLabel(false)).toBe("Ajouter au panier");
    expect(getCartConfirmationLabel(true)).toBe("Ajouté au panier");
  });

  it("laisse la confirmation visible assez longtemps pour être perçue", () => {
    expect(CART_CONFIRMATION_DURATION_MS).toBeGreaterThanOrEqual(1000);
  });
});
