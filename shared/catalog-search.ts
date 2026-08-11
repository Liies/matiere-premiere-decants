export type NamedProduct = {
  name: string;
};

export function normalizeCatalogSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR")
    .trim();
}

export function searchProductsByName<T extends NamedProduct>(products: T[], query: string) {
  const normalizedQuery = normalizeCatalogSearchText(query);
  if (!normalizedQuery) return products;

  return products.filter((product) =>
    normalizeCatalogSearchText(product.name).includes(normalizedQuery),
  );
}
