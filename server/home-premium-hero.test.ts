import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getHeroScrollBehavior, HERO_NEXT_SECTION_ID } from "../shared/home-hero";

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

  it("dirige le bouton vers la section suivante et conserve le mouvement réduit", () => {
    expect(HERO_NEXT_SECTION_ID).toBe("story");
    expect(getHeroScrollBehavior(false)).toBe("smooth");
    expect(getHeroScrollBehavior(true)).toBe("auto");
    expect(homePremiumSource).toContain('onClick={scrollToStory}');
  });

  it("utilise la composition éditoriale des dix flacons sous le hero", () => {
    expect(homePremiumSource).toContain("matiere-premiere-ten-bottles-editorial_30095232.jpg");
    expect(homePremiumSource).toContain("Dix flacons de la collection Matière Première, composition éditoriale");
  });

  it("ne réserve plus une hauteur plein écran sous le visuel hero", () => {
    expect(homePremiumSource).not.toContain("min-h-[calc(100svh-4.5rem)]");
    expect(homePremiumSource).not.toContain("min-h-[calc(100svh-14.5rem)]");
    expect(homePremiumSource).toContain("relative overflow-hidden px-4 py-14");
  });
});
