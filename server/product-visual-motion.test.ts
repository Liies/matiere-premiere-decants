import { describe, expect, it } from "vitest";
import { getProductVisualMotion } from "@shared/product-visual-motion";

describe("mouvement du visuel produit", () => {
  it("reste neutre au début de la page et progresse avec un mouvement contenu", () => {
    expect(getProductVisualMotion(0)).toEqual({ scale: 1, translateX: 0, translateY: 0, rotate: 0 });
    expect(getProductVisualMotion(260)).toEqual({ scale: 1.0394, translateX: 3.06, translateY: -15.75, rotate: 0.525 });
  });

  it("borne le mouvement à une amplitude discrète", () => {
    expect(getProductVisualMotion(9999)).toEqual({ scale: 1.045, translateX: 3.5, translateY: -18, rotate: 0.6 });
    expect(getProductVisualMotion(-80)).toEqual({ scale: 1, translateX: 0, translateY: 0, rotate: 0 });
  });
});
