import { OLFACTORY_FILTERS } from "./olfactory";

export function getOlfactoryFilterIdFromHash(hash: string) {
  const candidate = hash.replace(/^#/, "").trim();
  return OLFACTORY_FILTERS.some((filter) => filter.id === candidate) ? candidate : null;
}
