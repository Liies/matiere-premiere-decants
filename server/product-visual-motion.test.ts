import { describe, expect, it } from "vitest";
import { getProductVisualMotion } from "@shared/product-visual-motion";

describe("mouvement du visuel produit", () => {
  it("reste neutre au début de la page et progresse avec un mouvement contenu", () => {
    expect(getProductVisualMotion(0)).toEqual({ scale: 1, translateY: 0, rotate: 0 });
    expect(getProductVisualMotion(260)).toEqual({ scale: 1.0175, translateY: -7, rotate: 0.175 });
  });

  it("borne le mouvement à une amplitude discrète", () => {
    expect(getProductVisualMotion(9999)).toEqual({ scale: 1.035, translateY: -14, rotate: 0.35 });
    expect(getProductVisualMotion(-80)).toEqual({ scale: 1, translateY: 0, rotate: 0 });
  });
});
