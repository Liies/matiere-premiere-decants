import { LEGACY_CATALOG_PRICE_CENTS, MULTI_BRAND_CATALOG, notesAsText } from "./catalog-data";

/** Adaptateur temporaire pour les composants historiques : la source métier reste catalog-data.ts. */
export interface ProductData {
  name: string;
  slug: string;
  description: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  price: number;
  stock: number;
}

export const UNIFORM_CATALOG_PRICE_CENTS = LEGACY_CATALOG_PRICE_CENTS;

export const MATIERE_PREMIERE_PRODUCTS: ProductData[] = MULTI_BRAND_CATALOG
  .filter((product) => product.brandSlug === "matiere-premiere")
  .map((product) => ({
    name: product.name,
    slug: product.slug,
    description: product.description,
    topNotes: notesAsText(product.notes.top),
    heartNotes: notesAsText(product.notes.heart),
    baseNotes: notesAsText(product.notes.base),
    price: LEGACY_CATALOG_PRICE_CENTS,
    stock: 0,
  }));
