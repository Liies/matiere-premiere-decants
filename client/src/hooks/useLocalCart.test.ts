/** @vitest-environment jsdom */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalCart } from "./useLocalCart";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useLocalCart", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useLocalCart());

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it("should add item to cart", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 1);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toMatchObject({
      productId: 1,
      quantity: 1,
      name: "Vanilla Powder",
      price: 5000,
    });
  });

  it("should increase quantity when adding same product twice", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 1);
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 2);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]?.quantity).toBe(3);
  });

  it("should update quantity", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 1);
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cartItems[0]?.quantity).toBe(5);
  });

  it("should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 1);
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it("should remove item", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 1);
      result.current.addToCart({ id: 2, name: "Crystal Saffron", price: 6000 }, 1);
      result.current.removeItem(1);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]?.productId).toBe(2);
  });

  it("should calculate total price correctly", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 2);
      result.current.addToCart({ id: 2, name: "Crystal Saffron", price: 6000 }, 1);
    });

    expect(result.current.getTotalPrice()).toBe(16000);
  });

  it("should calculate total items correctly", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 2);
      result.current.addToCart({ id: 2, name: "Crystal Saffron", price: 6000 }, 3);
    });

    expect(result.current.getTotalItems()).toBe(5);
  });

  it("should clear cart", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 1);
      result.current.addToCart({ id: 2, name: "Crystal Saffron", price: 6000 }, 1);
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it("should persist cart to localStorage", () => {
    const { result } = renderHook(() => useLocalCart());

    act(() => {
      result.current.addToCart({ id: 1, name: "Vanilla Powder", price: 5000 }, 1);
    });

    const stored = localStorage.getItem("matiere-premiere-cart");
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      productId: 1,
      quantity: 1,
    });
  });
});
