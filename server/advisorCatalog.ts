import { buildAdvisorCatalogContext, type AdvisorCatalogProduct } from "@shared/advisor";
import { getCatalogProducts, getVariantsByProductIds } from "./db";

export type AdvisorCatalogSnapshot = {
  catalog: AdvisorCatalogProduct[];
  context: string;
};

let cachedSnapshot: AdvisorCatalogSnapshot | null = null;

export function invalidateAdvisorCatalogCache(): void {
  cachedSnapshot = null;
}

export async function getAdvisorCatalogSnapshot(): Promise<AdvisorCatalogSnapshot> {
  if (cachedSnapshot) return cachedSnapshot;

  const rows = await getCatalogProducts();
  const productIds = rows.map((row) => row.product.id);
  const variants = productIds.length > 0 ? await getVariantsByProductIds(productIds) : [];
  const variantsByProductId = new Map<number, typeof variants>();

  for (const variant of variants) {
    const list = variantsByProductId.get(variant.productId) ?? [];
    list.push(variant);
    variantsByProductId.set(variant.productId, list);
  }

  const catalog = rows.map(({ product }) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    status: product.status,
    isArchived: product.isArchived,
    topNotes: product.topNotes,
    heartNotes: product.heartNotes,
    baseNotes: product.baseNotes,
    variants: (variantsByProductId.get(product.id) ?? []).map((variant) => ({
      id: variant.id,
      sizeMl: variant.sizeMl,
      sku: variant.sku,
      priceCents: variant.priceCents,
      stock: variant.stock,
      isActive: variant.isActive,
    })),
  } satisfies AdvisorCatalogProduct));

  cachedSnapshot = { catalog, context: buildAdvisorCatalogContext(catalog) };
  return cachedSnapshot;
}
