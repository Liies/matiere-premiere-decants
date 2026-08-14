import {
  MAX_ADVISOR_MESSAGE_LENGTH,
  parseAdvisorModelResponse,
  validateAdvisorRecommendations,
} from "@shared/advisor";
import { invokeLLM, type InvokeResult } from "./_core/llm";
import { getAdvisorCatalogSnapshot } from "./advisorCatalog";

export type AdvisorChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AdvisorServiceResponse = {
  reply: string;
  recommendations: Array<{
    productSlug: string;
    reason: string;
    suggestedSizeMl: number;
  }>;
};

const advisorResponseFormat = {
  type: "json_schema" as const,
  json_schema: {
    name: "advisor_response",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reply: { type: "string" },
        recommendations: {
          type: "array",
          maxItems: 4,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              productSlug: { type: "string" },
              reason: { type: "string" },
              suggestedSizeMl: { type: "integer" },
            },
            required: ["productSlug", "reason", "suggestedSizeMl"],
          },
        },
      },
      required: ["reply", "recommendations"],
    },
  },
};

function getAssistantContent(result: InvokeResult): string {
  const content = result.choices[0]?.message.content;
  if (typeof content === "string") return content;
  if (!content) return "";
  return content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");
}

function sanitizeModelText(text: string, catalogNames: string[]): string {
  let sanitized = text;
  for (const name of catalogNames) {
    sanitized = sanitized.replaceAll(name, "cette référence");
  }
  return sanitized
    .replace(/\b\d+(?:[,.]\d{1,2})?\s?€/g, "son prix indiqué")
    .replace(/\b(disponible|épuisé|en stock|hors stock)\b/gi, "à vérifier sur la fiche");
}

function buildSystemPrompt(catalogContext: string): string {
  return `Vous êtes le conseiller olfactif de Matière Première. Vous répondez exclusivement en français, avec vouvoiement, dans un ton sobre et expert sans jargon inutile.

Votre rôle est de conseiller uniquement les références du catalogue ci-dessous. Vous pouvez évoquer des parfums extérieurs au catalogue uniquement à titre de comparaison, mais ne les recommandez jamais. Pour toute demande hors parfumerie, refusez brièvement et poliment.

Ne mentionnez jamais dans votre champ reply un nom de parfum, une contenance, un prix ni une disponibilité : les cartes affichées à part contiennent exclusivement ces données vérifiées. Dans reply, justifiez seulement les familles, matières et usages en une à deux phrases. Retournez deux à quatre recommandations uniquement lorsqu'elles sont pertinentes ; sinon, un tableau vide.

CATALOGUE VÉRIFIÉ :
${catalogContext}`;
}

async function requestStructuredAdvice(messages: AdvisorChatMessage[], systemPrompt: string) {
  const result = await invokeLLM({
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    responseFormat: advisorResponseFormat,
    maxTokens: 900,
  });
  return { parsed: parseAdvisorModelResponse(getAssistantContent(result)), result };
}

export async function askAdvisor(messages: AdvisorChatMessage[]): Promise<AdvisorServiceResponse> {
  const startedAt = Date.now();
  const snapshot = await getAdvisorCatalogSnapshot();
  const systemPrompt = buildSystemPrompt(snapshot.context);
  const firstAttempt = await requestStructuredAdvice(messages, systemPrompt);
  const successfulAttempt = firstAttempt.parsed
    ? firstAttempt
    : await requestStructuredAdvice(messages, `${systemPrompt}\nRépondez strictement avec le JSON demandé.`);

  if (!successfulAttempt.parsed) {
    throw new Error("Le conseiller n'a pas pu structurer sa réponse.");
  }

  const validated = validateAdvisorRecommendations(successfulAttempt.parsed, snapshot.catalog);
  const names = snapshot.catalog.map((product) => product.name);
  const reply = sanitizeModelText(successfulAttempt.parsed.reply, names);
  const usage = successfulAttempt.result.usage;
  console.info("[Advisor]", {
    messageCount: messages.length,
    promptTokens: usage?.prompt_tokens ?? null,
    completionTokens: usage?.completion_tokens ?? null,
    totalTokens: usage?.total_tokens ?? null,
    durationMs: Date.now() - startedAt,
  });

  return {
    reply,
    recommendations: validated.map(({ product, variant, reason }) => ({
      productSlug: product.slug,
      reason: sanitizeModelText(reason, names),
      suggestedSizeMl: variant.sizeMl,
    })),
  };
}

export function hasValidAdvisorMessageLength(content: string): boolean {
  return content.length > 0 && content.length <= MAX_ADVISOR_MESSAGE_LENGTH;
}
