import type { Variant } from "../drizzle/schema";

/** Classe les variantes pour offrir un ordre commercial stable. */
export function sortVariants(variantList: Variant[]): Variant[] {
  return [...variantList].sort((left, right) => left.sortOrder - right.sortOrder || left.sizeMl - right.sizeMl || left.id - right.id);
}

/** Détermine la première contenance achetable, puis la première contenance active. */
export function getDefaultVariant(variantList: Variant[]): Variant | null {
  const activeVariants = sortVariants(variantList.filter((variant) => variant.isActive));
  return activeVariants.find((variant) => variant.stock > 0) ?? activeVariants[0] ?? null;
}

/** Retourne la fourchette de prix des variantes actives. */
export function getPriceRange(variantList: Variant[]): { minCents: number; maxCents: number } | null {
  const prices = variantList.filter((variant) => variant.isActive).map((variant) => variant.priceCents);
  if (prices.length === 0) return null;
  return { minCents: Math.min(...prices), maxCents: Math.max(...prices) };
}

/** Formate une contenance sans ambiguïté dans l’interface française. */
export function formatSize(sizeMl: number): string {
  return `${sizeMl} ml`;
}

/** Calcule le prix au millilitre, arrondi au centime entier. */
export function computePricePerMlCents(variant: Variant): number {
  return Math.round(variant.priceCents / variant.sizeMl);
}

/** Une variante est vendable uniquement si elle est active et possède du stock. */
export function isVariantAvailable(variant: Variant): boolean {
  return variant.isActive && variant.stock > 0;
}
