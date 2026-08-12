/** @vitest-environment jsdom */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useWishlist } from "./useWishlist";
import { WISHLIST_STORAGE_KEY } from "@shared/wishlist";

describe("useWishlist", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("initialise une liste vide, ajoute un parfum et conserve le choix", () => {
    const { result } = renderHook(() => useWishlist());

    expect(result.current.wishlistIds).toEqual([]);

    act(() => {
      expect(result.current.toggleWishlist(10)).toBe(true);
    });

    expect(result.current.isWishlisted(10)).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]")).toEqual([10]);
  });

  it("retire un parfum sans modifier les autres choix", () => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([10, 20]));
    const { result } = renderHook(() => useWishlist());

    act(() => {
      expect(result.current.toggleWishlist(10)).toBe(false);
    });

    expect(result.current.wishlistIds).toEqual([20]);
    expect(result.current.isWishlisted(10)).toBe(false);
    expect(result.current.isWishlisted(20)).toBe(true);
  });

  it("synchronise deux composants ouverts dans le même onglet", () => {
    const catalogue = renderHook(() => useWishlist());
    const ficheProduit = renderHook(() => useWishlist());

    act(() => {
      catalogue.result.current.toggleWishlist(42);
    });

    expect(catalogue.result.current.isWishlisted(42)).toBe(true);
    expect(ficheProduit.result.current.isWishlisted(42)).toBe(true);
  });

  it("prend en compte une mise à jour localStorage provenant d’un autre onglet", () => {
    const { result } = renderHook(() => useWishlist());

    act(() => {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([7]));
      window.dispatchEvent(new StorageEvent("storage", { key: WISHLIST_STORAGE_KEY }));
    });

    expect(result.current.wishlistIds).toEqual([7]);
    expect(result.current.isWishlisted(7)).toBe(true);
  });
});
