// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WISHLIST_STORAGE_KEY } from "@shared/wishlist";

const state = vi.hoisted(() => ({
  isAuthenticated: false,
  addToLocalCart: vi.fn(),
  addVariantMutate: vi.fn(),
  invalidateCart: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ cart: { getItems: { invalidate: state.invalidateCart } } }),
    products: {
      list: {
        useQuery: () => ({
          data: [
            {
              id: 1,
              name: "Vanilla Powder",
              price: 12000,
              volumeMl: 50,
              imageUrl: "/manus-storage/vanilla.jpg",
              variants: [{ id: 101, productId: 1, sizeMl: 50, priceCents: 12000, stock: 3, isActive: true }],
            },
            {
              id: 2,
              name: "Crystal Saffron",
              price: 12000,
              volumeMl: 50,
              imageUrl: "/manus-storage/crystal.jpg",
              variants: [{ id: 201, productId: 2, sizeMl: 50, priceCents: 12000, stock: 0, isActive: true }],
            },
          ],
          isLoading: false,
        }),
      },
    },
    cart: {
      addVariant: {
        useMutation: () => ({ mutate: state.addVariantMutate, isPending: false }),
      },
    },
  },
}));
vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: state.isAuthenticated, user: state.isAuthenticated ? { id: 1 } : null }),
}));
vi.mock("@/hooks/useLocalCart", () => ({
  useLocalCart: () => ({ addToCart: state.addToLocalCart }),
}));
vi.mock("@shared/image-assets", () => ({ getProductImage: () => null }));
vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({ Link: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import Wishlist from "./Wishlist";

describe("liste de favoris — ajout au panier", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/wishlist");
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([1, 2]));
    state.isAuthenticated = false;
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("ajoute la variante disponible au panier local depuis les favoris et confirme l’action", () => {
    render(<Wishlist />);

    fireEvent.click(screen.getByRole("button", { name: "Ajouter au panier" }));

    expect(state.addToLocalCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: "Vanilla Powder" }),
      expect.objectContaining({ id: 101, stock: 3 }),
      1,
      { announce: false },
    );
    expect(screen.getByRole("button", { name: "Ajouté au panier" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Indisponible" }).hasAttribute("disabled")).toBe(true);
  });

  it("utilise le panier connecté et rafraîchit son compteur après ajout", () => {
    state.isAuthenticated = true;
    state.addVariantMutate.mockImplementation((_input, callbacks) => callbacks.onSuccess());
    render(<Wishlist />);

    fireEvent.click(screen.getByRole("button", { name: "Ajouter au panier" }));

    expect(state.addVariantMutate).toHaveBeenCalledWith(
      { variantId: 101, quantity: 1 },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
    expect(state.invalidateCart).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Ajouté au panier" })).toBeTruthy();
  });
});
