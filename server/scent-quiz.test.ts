import { describe, expect, it } from "vitest";
import { getScentQuizRecommendation } from "../shared/scent-quiz";

describe("recommandation du quiz olfactif", () => {
  it("recommande une fraîcheur lumineuse de journée", () => {
    const result = getScentQuizRecommendation({
      family: "frais",
      mood: "lumineux",
      intensity: "leger",
      occasion: "jour",
    });

    expect(result.recommendation.name).toBe("Cologne Cédrat");
    expect(result.alternatives.map((alternative) => alternative.slug)).not.toContain(result.recommendation.slug);
  });

  it("recommande un cuir intense pour une préférence mystérieuse du soir", () => {
    const result = getScentQuizRecommendation({
      family: "boise",
      mood: "mysterieux",
      intensity: "intense",
      occasion: "soir",
    });

    expect(result.recommendation.name).toBe("Falcon Leather");
  });

  it("reste déterministe lorsqu’une réponse est manquante ou inconnue", () => {
    const result = getScentQuizRecommendation({ family: "inconnu" });

    expect(result.recommendation).toBeDefined();
    expect(result.alternatives).toHaveLength(2);
  });
});
