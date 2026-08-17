export const SHARED_WISHLIST_QUERY_KEY = "selection";

function normalizeIds(ids: number[]) {
  return Array.from(new Set(ids.filter((id) => Number.isInteger(id) && id > 0)));
}

export function parseSharedWishlistIds(search: string): number[] {
  const rawSelection = new URLSearchParams(search).get(SHARED_WISHLIST_QUERY_KEY);
  if (!rawSelection) return [];

  return normalizeIds(rawSelection.split(",").map((value) => Number(value)));
}

export function createSharedWishlistPath(ids: number[]): string {
  const selection = normalizeIds(ids);
  if (selection.length === 0) return "/wishlist";
  return `/wishlist?${SHARED_WISHLIST_QUERY_KEY}=${selection.join(",")}`;
}
