/** @vitest-environment jsdom */

import React from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = {
  authenticated: true,
  loaded: true,
  items: [{ productId: 1, variantId: 101, sizeMl: 2, quantity: 2, name: "Vanilla Powder", price: 1000 }],
};
const clearCart = vi.fn();
const invalidateCart = vi.fn().mockResolvedValue(undefined);
const mutate = vi.fn();

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: state.authenticated }),
}));

vi.mock("@/hooks/useLocalCart", () => ({
  CART_STORAGE_KEY: "matiere-premiere-cart",
  CART_SYNC_KEY_STORAGE_KEY: "matiere-premiere-cart-sync-key",
  useLocalCart: () => ({ cartItems: state.items, clearCart, isLoaded: state.loaded }),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ cart: { getItems: { invalidate: invalidateCart } } }),
    cart: {
      syncGuestCart: {
        useMutation: () => ({ mutate, isPending: false }),
      },
    },
  },
}));

import { useCartSyncOnSignIn } from "./useCartSyncOnSignIn";

function Probe() {
  useCartSyncOnSignIn();
  return null;
}

describe("useCartSyncOnSignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    state.authenticated = true;
    state.loaded = true;
    state.items = [{ productId: 1, variantId: 101, sizeMl: 2, quantity: 2, name: "Vanilla Powder", price: 1000 }];
  });

  afterEach(() => cleanup());

  it("vide le panier local uniquement après une fusion confirmée", async () => {
    window.localStorage.setItem("matiere-premiere-cart", JSON.stringify(state.items));
    mutate.mockImplementation((_input, callbacks) => callbacks.onSuccess({ alreadySynced: false }));

    render(<Probe />);

    await waitFor(() => expect(clearCart).toHaveBeenCalledTimes(1));
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ items: [{ productId: 1, variantId: 101, quantity: 2 }] }),
      expect.any(Object),
    );
    expect(invalidateCart).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem("matiere-premiere-cart")).toBeNull();
  });

  it("conserve le panier local lorsqu’une fusion échoue pour permettre une reprise", async () => {
    window.localStorage.setItem("matiere-premiere-cart", JSON.stringify(state.items));
    mutate.mockImplementation((_input, callbacks) => callbacks.onError(new Error("Stock insuffisant")));

    render(<Probe />);

    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(1));
    expect(clearCart).not.toHaveBeenCalled();
    expect(window.localStorage.getItem("matiere-premiere-cart")).not.toBeNull();
    expect(window.localStorage.getItem("matiere-premiere-cart-sync-key")).not.toBeNull();
  });
});
