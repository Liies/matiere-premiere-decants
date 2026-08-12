import { describe, expect, it } from "vitest";
import { MASTER_PERFUMER_PROFILE } from "../shared/perfumer-profile";

describe("profil du parfumeur de l’accueil", () => {
  it("présente un créateur identifié et son rôle pour Matière Première", () => {
    expect(MASTER_PERFUMER_PROFILE.name).toBe("Aurélien Guichard");
    expect(MASTER_PERFUMER_PROFILE.role).toContain("Matière Première");
    expect(MASTER_PERFUMER_PROFILE.biography).not.toContain("Maître Parfumeur I");
    expect(MASTER_PERFUMER_PROFILE.biography).not.toContain("Maître Parfumeur II");
  });

  it("conserve des créations de la maison et des repères de créations externes", () => {
    expect(MASTER_PERFUMER_PROFILE.matierePremiereCreations).toEqual(
      expect.arrayContaining(["Radical Rose", "French Flower", "Crystal Saffron"])
    );
    expect(MASTER_PERFUMER_PROFILE.externalCreations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ house: "Gucci", name: "Gucci Guilty" }),
        expect.objectContaining({ house: "Versace", name: "Eros" }),
      ])
    );
  });

  it("associe le contenu éditorial à ses sources publiques", () => {
    expect(MASTER_PERFUMER_PROFILE.sources.official).toBe("https://matiere-premiere.com/en");
    expect(MASTER_PERFUMER_PROFILE.sources.interview).toContain("cafleurebon.com");
  });
});
