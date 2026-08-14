import { z } from "zod";
import { formatPrice } from "./price";
import { OLFACTORY_FILTERS, productMatchesOlfactoryFilter } from "./olfactory";

export const MAX_ADVISOR_MESSAGES = 12;
export const MAX_ADVISOR_MESSAGE_LENGTH = 1500;

export type AdvisorCatalogVariant = {
  id: number;
  sizeMl: number;
  sku: string;
  priceCents: number;
  stock: number;
  isActive: boolean;
};

export type AdvisorCatalogProduct = {
  id: number;
  slug: string;
  name: string;
  status: "available" | "out_of_stock" | "discontinued" | "coming_soon";
  isArchived: boolean;
  topNotes: string | null;
  heartNotes: string | null;
  baseNotes: string | null;
  variants: AdvisorCatalogVariant[];
};

const modelResponseSchema = z.object({
  reply: z.string().trim().min(1).max(1200),
  recommendations: z.array(z.object({
    productSlug: z.string().trim().min(1).max(255),
    reason: z.string().trim().min(1).max(500),
    suggestedSizeMl: z.number().int().positive().optional(),
  })).max(4),
});

export type AdvisorModelResponse = z.infer<typeof modelResponseSchema>;

export type ValidatedAdvisorRecommendation = {
  product: AdvisorCatalogProduct;
  variant: AdvisorCatalogVariant;
  reason: string;
};

export function isAdvisorConversationAllowed(messageCount: number): boolean {
  return messageCount >= 1 && messageCount <= MAX_ADVISOR_MESSAGES;
}

export function parseAdvisorModelResponse(content: string): AdvisorModelResponse | null {
  try {
    return modelResponseSchema.safeParse(JSON.parse(content)).data ?? null;
  } catch {
    return null;
  }
}

export function getAvailableVariant(
  variants: AdvisorCatalogVariant[],
  suggestedSizeMl?: number,
): AdvisorCatalogVariant | null {
  const available = variants
    .filter((variant) => variant.isActive && variant.stock > 0)
    .sort((left, right) => left.sizeMl - right.sizeMl);

  if (available.length === 0) return null;
  return available.find((variant) => variant.sizeMl === suggestedSizeMl) ?? available[0];
}

export function validateAdvisorRecommendations(
  response: AdvisorModelResponse,
  catalog: AdvisorCatalogProduct[],
): ValidatedAdvisorRecommendation[] {
  const bySlug = new Map(catalog.map((product) => [product.slug, product]));
  const acceptedSlugs = new Set<string>();

  return response.recommendations.flatMap((recommendation) => {
    if (acceptedSlugs.has(recommendation.productSlug)) return [];
    const product = bySlug.get(recommendation.productSlug);
    if (!product || product.isArchived || product.status !== "available") return [];

    const variant = getAvailableVariant(product.variants, recommendation.suggestedSizeMl);
    if (!variant) return [];

    acceptedSlugs.add(product.slug);
    return [{ product, variant, reason: recommendation.reason }];
  });
}

function summarizeNotes(product: AdvisorCatalogProduct): string {
  const parts = [
    product.topNotes ? `tête : ${product.topNotes}` : "",
    product.heartNotes ? `cœur : ${product.heartNotes}` : "",
    product.baseNotes ? `fond : ${product.baseNotes}` : "",
  ].filter(Boolean);
  return parts.join(" ; ");
}

function summarizeFamilies(product: AdvisorCatalogProduct): string {
  const families = OLFACTORY_FILTERS
    .filter((filter) => productMatchesOlfactoryFilter(product, filter.id))
    .map((filter) => filter.label);
  return families.length > 0 ? families.join(", ") : "sans famille détectée";
}

export function buildAdvisorCatalogContext(catalog: AdvisorCatalogProduct[]): string {
  const activeProducts = catalog.filter((product) => !product.isArchived && product.status === "available");
  if (activeProducts.length === 0) return "Aucun parfum n'est actuellement disponible au catalogue.";

  return activeProducts.map((product) => {
    const availableVariants = product.variants
      .filter((variant) => variant.isActive && variant.stock > 0)
      .sort((left, right) => left.priceCents - right.priceCents);
    const availability = availableVariants.length > 0 ? "disponible" : "épuisé";
    const range = availableVariants.length > 0
      ? `${formatPrice(availableVariants[0].priceCents)} à ${formatPrice(availableVariants[availableVariants.length - 1].priceCents)}`
      : "indisponible";
    const sizes = availableVariants.map((variant) => `${variant.sizeMl} ml`).join(", ") || "aucun format";
    return `- slug=${product.slug} | ${product.name} | familles: ${summarizeFamilies(product)} | ${availability} | formats: ${sizes} | prix: ${range} | ${summarizeNotes(product)}`;
  }).join("\n");
}
