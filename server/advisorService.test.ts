import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdvisorCatalogSnapshot } from "./advisorCatalog";
import type { InvokeResult } from "./_core/llm";

const mocks = vi.hoisted(() => ({
  invokeLLM: vi.fn(),
  getAdvisorCatalogSnapshot: vi.fn(),
}));

vi.mock("./_core/llm", () => ({ invokeLLM: mocks.invokeLLM }));
vi.mock("./advisorCatalog", () => ({ getAdvisorCatalogSnapshot: mocks.getAdvisorCatalogSnapshot }));

import { askAdvisor } from "./advisorService";

const snapshot: AdvisorCatalogSnapshot = {
  context: "- slug=vanilla-powder | Vanilla Powder | disponible",
  catalog: [{
    id: 1,
    slug: "vanilla-powder",
    name: "Vanilla Powder",
    status: "available",
    isArchived: false,
    topNotes: "Coco",
    heartNotes: "Orchidée",
    baseNotes: "Vanille",
    variants: [{ id: 1, sizeMl: 2, sku: "MP-VP-02", priceCents: 1000, stock: 3, isActive: true }],
  }],
};

function modelResult(content: string): InvokeResult {
  return {
    id: "response-id",
    created: 0,
    model: "test-model",
    choices: [{
      index: 0,
      message: { role: "assistant", content },
      finish_reason: "stop",
    }],
    usage: { prompt_tokens: 12, completion_tokens: 8, total_tokens: 20 },
  };
}

describe("askAdvisor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAdvisorCatalogSnapshot.mockResolvedValue(snapshot);
  });

  it("retries exactly once after malformed JSON", async () => {
    mocks.invokeLLM
      .mockResolvedValueOnce(modelResult("not-json"))
      .mockResolvedValueOnce(modelResult(JSON.stringify({
        reply: "Je vous propose un accord doux pour le soir.",
        recommendations: [{ productSlug: "vanilla-powder", reason: "Un accord chaud", suggestedSizeMl: 2 }],
      })));

    const response = await askAdvisor([{ role: "user", content: "Une vanille de soirée" }]);
    expect(mocks.invokeLLM).toHaveBeenCalledTimes(2);
    expect(response.recommendations).toEqual([{ productSlug: "vanilla-powder", reason: "Un accord chaud", suggestedSizeMl: 2 }]);
  });

  it("does not return an invented product slug", async () => {
    mocks.invokeLLM.mockResolvedValueOnce(modelResult(JSON.stringify({
      reply: "Je privilégie une facette chaleureuse.",
      recommendations: [{ productSlug: "invented-perfume", reason: "Inexistant", suggestedSizeMl: 2 }],
    })));

    const response = await askAdvisor([{ role: "user", content: "Un parfum chaleureux" }]);
    expect(response.recommendations).toEqual([]);
  });
});
