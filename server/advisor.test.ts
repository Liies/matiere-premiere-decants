import { describe, expect, it } from "vitest";
import {
  MAX_ADVISOR_MESSAGES,
  buildAdvisorCatalogContext,
  isAdvisorConversationAllowed,
  parseAdvisorModelResponse,
  validateAdvisorRecommendations,
  type AdvisorCatalogProduct,
} from "@shared/advisor";

const vanilla: AdvisorCatalogProduct = {
  id: 1,
  slug: "vanilla-powder",
  name: "Vanilla Powder",
  status: "available",
  isArchived: false,
  topNotes: "Noix de coco",
  heartNotes: "Orchidée",
  baseNotes: "Vanille",
  variants: [
    { id: 11, sku: "MP-VP-02", sizeMl: 2, priceCents: 1000, stock: 10, isActive: true },
    { id: 12, sku: "MP-VP-50", sizeMl: 50, priceCents: 12000, stock: 0, isActive: true },
  ],
};

const archived: AdvisorCatalogProduct = {
  ...vanilla,
  id: 2,
  slug: "archived-perfume",
  isArchived: true,
};

describe("advisor shared rules", () => {
  it("builds a compact context from the live catalog", () => {
    const context = buildAdvisorCatalogContext([vanilla, archived]);
    expect(context).toContain("vanilla-powder");
    expect(context).not.toContain("archived-perfume");
    expect(context).toContain("10,00");
  });

  it("silently removes unknown and archived recommendations", () => {
    const response = parseAdvisorModelResponse(JSON.stringify({
      reply: "Voici une sélection.",
      recommendations: [
        { productSlug: "unknown", reason: "Inconnu" },
        { productSlug: "archived-perfume", reason: "Archivé" },
        { productSlug: "vanilla-powder", reason: "Vanille élégante", suggestedSizeMl: 50 },
      ],
    }));
    expect(response).not.toBeNull();
    const validated = validateAdvisorRecommendations(response!, [vanilla, archived]);
    expect(validated).toHaveLength(1);
    expect(validated[0].variant.sizeMl).toBe(2);
  });

  it("does not validate an out-of-stock product", () => {
    const unavailable = { ...vanilla, variants: vanilla.variants.map((variant) => ({ ...variant, stock: 0 })) };
    const response = parseAdvisorModelResponse(JSON.stringify({
      reply: "Essayez cette option.",
      recommendations: [{ productSlug: "vanilla-powder", reason: "Accord boisé" }],
    }));
    expect(validateAdvisorRecommendations(response!, [unavailable])).toEqual([]);
  });

  it("rejects malformed model JSON and empty recommendation arrays", () => {
    expect(parseAdvisorModelResponse("not-json")).toBeNull();
    const response = parseAdvisorModelResponse(JSON.stringify({ reply: "Je vous écoute.", recommendations: [] }));
    expect(response?.recommendations).toEqual([]);
  });

  it("enforces the maximum conversation length", () => {
    expect(isAdvisorConversationAllowed(MAX_ADVISOR_MESSAGES)).toBe(true);
    expect(isAdvisorConversationAllowed(MAX_ADVISOR_MESSAGES + 1)).toBe(false);
  });
});
