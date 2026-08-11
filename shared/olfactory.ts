export type OlfactoryProduct = {
  topNotes: string | null;
  heartNotes: string | null;
  baseNotes: string | null;
};

export type OlfactoryFilter = {
  id: string;
  label: string;
  terms: string[];
};

export const OLFACTORY_FILTERS: OlfactoryFilter[] = [
  { id: "boise", label: "Boisé", terms: ["bois", "santal", "vétiver", "ébène", "cèdre"] },
  { id: "floral", label: "Floral", terms: ["rose", "néroli", "fleurs", "lavande", "géranium"] },
  { id: "epice", label: "Épicé", terms: ["safran", "épices", "poivre"] },
  { id: "vanille", label: "Vanillé", terms: ["vanille", "amande"] },
  { id: "cuire", label: "Cuiré", terms: ["cuir", "tabac"] },
  { id: "ambre", label: "Ambré", terms: ["ambre", "résine"] },
  { id: "frais", label: "Frais & agrumes", terms: ["bergamote", "citron", "cédrat", "vertes", "minérales"] },
  { id: "musc", label: "Musc", terms: ["musc"] },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR");
}

export function getProductNoteText(product: OlfactoryProduct) {
  return normalize(`${product.topNotes ?? ""} ${product.heartNotes ?? ""} ${product.baseNotes ?? ""}`);
}

export function productMatchesOlfactoryFilter(
  product: OlfactoryProduct,
  filterId: string,
) {
  const filter = OLFACTORY_FILTERS.find((item) => item.id === filterId);
  if (!filter) return false;

  const notes = getProductNoteText(product);
  return filter.terms.some((term) => notes.includes(normalize(term)));
}

/**
 * Plusieurs filtres sélectionnés sont combinés en mode « au moins une note ».
 * Sans filtre actif, le catalogue complet est retourné.
 */
export function filterProductsByNotes<T extends OlfactoryProduct>(
  products: T[],
  selectedFilterIds: string[],
) {
  if (selectedFilterIds.length === 0) return products;

  return products.filter((product) =>
    selectedFilterIds.some((filterId) => productMatchesOlfactoryFilter(product, filterId)),
  );
}
