/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CART_STORAGE_KEY, CART_STORAGE_VERSION, useLocalCart } from "./useLocalCart";

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const vanilla = { id: 1, name: "Vanilla Powder" };
const vanilla2ml = { id: 101, sizeMl: 2, priceCents: 1_000 };
const vanilla50ml = { id: 102, sizeMl: 50, priceCents: 12_000 };
const saffron = { id: 2, name: "Crystal Saffron" };
const saffron2ml = { id: 201, sizeMl: 2, priceCents: 1_000 };

describe("useLocalCart", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("initialise un panier vide", () => {
    const { result } = renderHook(() => useLocalCart());
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it("conserve deux lignes distinctes pour les formats 2 ml et 50 ml du même parfum", () => {
    const { result } = renderHook(() => useLocalCart());
    act(() => {
      result.current.addToCart(vanilla, vanilla2ml, 1);
      result.current.addToCart(vanilla, vanilla50ml, 1);
    });

    expect(result.current.cartItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ productId: 1, variantId: 101, sizeMl: 2, price: 1_000, quantity: 1 }),
      expect.objectContaining({ productId: 1, variantId: 102, sizeMl: 50, price: 12_000, quantity: 1 }),
    ]));
    expect(result.current.getTotalPrice()).toBe(13_000);
  });

  it("fusionne seulement les ajouts portant sur une même variante", () => {
    const { result } = renderHook(() => useLocalCart());
    act(() => {
      result.current.addToCart(vanilla, vanilla2ml, 1);
      result.current.addToCart(vanilla, vanilla2ml, 2);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toMatchObject({ variantId: 101, quantity: 3 });
  });

  it("met à jour et retire une ligne par identifiant de variante", () => {
    const { result } = renderHook(() => useLocalCart());
    act(() => {
      result.current.addToCart(vanilla, vanilla2ml, 1);
      result.current.addToCart(vanilla, vanilla50ml, 1);
      result.current.updateQuantity(vanilla2ml.id, 4);
      result.current.removeItem(vanilla50ml.id);
    });

    expect(result.current.cartItems).toEqual([expect.objectContaining({ variantId: vanilla2ml.id, quantity: 4 })]);
  });

  it("calcule les totaux des prix propres à chaque variante", () => {
    const { result } = renderHook(() => useLocalCart());
    act(() => {
      result.current.addToCart(vanilla, vanilla2ml, 2);
      result.current.addToCart(saffron, saffron2ml, 3);
    });

    expect(result.current.getTotalItems()).toBe(5);
    expect(result.current.getTotalPrice()).toBe(5_000);
  });

  it("persiste les métadonnées de variante dans une enveloppe versionnée", () => {
    const { result } = renderHook(() => useLocalCart());
    act(() => result.current.addToCart(vanilla, vanilla2ml, 1));
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!)).toEqual({
      version: CART_STORAGE_VERSION,
      items: [expect.objectContaining({ productId: 1, variantId: 101, sizeMl: 2, price: 1_000, quantity: 1 })],
    });
  });

  it("écarte un panier d’ancien format ou illisible sans exposer d’erreur", () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ productId: 1, quantity: 2, name: "Vanilla Powder", price: 12_000 }]));
    const { result: reloaded } = renderHook(() => useLocalCart());
    expect(reloaded.current.cartItems).toEqual([]);

    localStorage.setItem(CART_STORAGE_KEY, "{invalide");
    const { result: malformed } = renderHook(() => useLocalCart());
    expect(malformed.current.cartItems).toEqual([]);
  });
});
