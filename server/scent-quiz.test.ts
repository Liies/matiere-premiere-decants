import { describe, expect, it } from "vitest";
import { getScentQuizRecommendation, SCENT_QUIZ_QUESTIONS } from "../shared/scent-quiz";

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

  it("expose quatre questions ordonnées avec des choix uniques", () => {
    expect(SCENT_QUIZ_QUESTIONS.map((question) => question.id)).toEqual([
      "family",
      "mood",
      "intensity",
      "occasion",
    ]);

    SCENT_QUIZ_QUESTIONS.forEach((question) => {
      expect(question.options.length).toBeGreaterThanOrEqual(3);
      expect(new Set(question.options.map((option) => option.id)).size).toBe(question.options.length);
      expect(question.options.every((option) => option.tags.length > 0)).toBe(true);
    });
  });

  it("garantit une recommandation et deux alternatives distinctes pour chaque combinaison de réponses", () => {
    const [family, mood, intensity, occasion] = SCENT_QUIZ_QUESTIONS;

    family.options.forEach((familyOption) => {
      mood.options.forEach((moodOption) => {
        intensity.options.forEach((intensityOption) => {
          occasion.options.forEach((occasionOption) => {
            const result = getScentQuizRecommendation({
              family: familyOption.id,
              mood: moodOption.id,
              intensity: intensityOption.id,
              occasion: occasionOption.id,
            });
            const selectedSlugs = [
              result.recommendation.slug,
              ...result.alternatives.map((alternative) => alternative.slug),
            ];

            expect(result.alternatives).toHaveLength(2);
            expect(new Set(selectedSlugs).size).toBe(3);
          });
        });
      });
    });
  });
});
