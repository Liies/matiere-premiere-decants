export const WISHLIST_STORAGE_KEY = "mp-wishlist-product-ids";
export const WISHLIST_UPDATED_EVENT = "mp-wishlist-updated";

export function parseWishlistIds(rawValue: string | null) {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return Array.from(new Set(parsed.filter((id): id is number => Number.isInteger(id) && id > 0)));
  } catch {
    return [];
  }
}

export function toggleWishlistId(ids: number[], productId: number) {
  return ids.includes(productId)
    ? ids.filter((id) => id !== productId)
    : [...ids, productId];
}
