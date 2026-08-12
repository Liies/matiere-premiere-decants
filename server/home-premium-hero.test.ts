import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homePremiumSource = readFileSync(
  new URL("../client/src/pages/HomePremium.tsx", import.meta.url),
  "utf8",
);

describe("hero de l’accueil premium", () => {
  it("ne présente plus de flacon décoratif sous le bouton d’exploration", () => {
    expect(homePremiumSource).not.toContain("hero-bottle-reveal");
    expect(homePremiumSource).not.toContain("hero-bottle-halo");
    expect(homePremiumSource).not.toContain("getProductImage(1)");
  });
});
