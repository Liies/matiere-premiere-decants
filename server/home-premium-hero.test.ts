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

  it("dirige le CTA principal vers le catalogue sans ajouter de détour narratif", () => {
    expect(homePremiumSource).toContain('<Link href="/products"');
    expect(homePremiumSource).toContain("Découvrir la collection");
  });

  it("ouvre le quiz de recommandation depuis le CTA final d’exploration", () => {
    expect(homePremiumSource).toContain('onClick={() => setIsScentQuizOpen(true)}');
    expect(homePremiumSource).toContain("<ScentQuizDialog open={isScentQuizOpen} onOpenChange={setIsScentQuizOpen} />");
  });

  it("utilise une unique composition éditoriale pour la collection", () => {
    expect(homePremiumSource).toContain("matiere-premiere-collection-hero_6296f243.png");
    expect(homePremiumSource).toContain("Six flacons Matière Première présentés sur des socles minéraux");
  });

  it("ne réserve plus une hauteur plein écran sous le visuel hero", () => {
    expect(homePremiumSource).not.toContain("min-h-[calc(100svh-4.5rem)]");
    expect(homePremiumSource).not.toContain("min-h-[calc(100svh-14.5rem)]");
    expect(homePremiumSource).toContain("relative overflow-hidden px-4 py-14");
  });

  it("retire les longues sections d’histoire, matières et créateur de l’accueil", () => {
    expect(homePremiumSource).not.toContain('id="story"');
    expect(homePremiumSource).not.toContain('id="ingredients"');
    expect(homePremiumSource).not.toContain('id="craft"');
    expect(homePremiumSource).not.toContain('id="noses"');
  });
});
