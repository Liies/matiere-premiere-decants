import { useCallback, useEffect, useState } from "react";
import {
  parseWishlistIds,
  toggleWishlistId,
  WISHLIST_STORAGE_KEY,
  WISHLIST_UPDATED_EVENT,
} from "@shared/wishlist";

function readWishlist() {
  if (typeof window === "undefined") return [];
  return parseWishlistIds(window.localStorage.getItem(WISHLIST_STORAGE_KEY));
}

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<number[]>(readWishlist);

  useEffect(() => {
    const syncWishlist = () => setWishlistIds(readWishlist());
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === WISHLIST_STORAGE_KEY) syncWishlist();
    };

    window.addEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  const toggleWishlist = useCallback((productId: number) => {
    const nextIds = toggleWishlistId(readWishlist(), productId);
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextIds));
    window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT));
    return nextIds.includes(productId);
  }, []);

  return {
    wishlistIds,
    isWishlisted: (productId: number) => wishlistIds.includes(productId),
    toggleWishlist,
  };
}
