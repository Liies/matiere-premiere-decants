import { describe, expect, it } from "vitest";
import { getConcentrationLabel } from "@shared/fragrance-concentration";

describe("libellés de concentration", () => {
  it("affiche précisément l’extrait et l’eau de parfum", () => {
    expect(getConcentrationLabel("extrait")).toBe("Extrait de Parfum");
    expect(getConcentrationLabel("edp")).toBe("Eau de Parfum");
  });

  it("n’invente aucun libellé lorsque la concentration est absente ou inconnue", () => {
    expect(getConcentrationLabel(null)).toBeNull();
    expect(getConcentrationLabel("inconnue")).toBeNull();
  });
});
