/** @vitest-environment jsdom */

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  localCartItems: [
    {
      productId: 1,
      variantId: 102,
      name: "Vanilla Powder",
      sizeMl: 50,
      price: 12_000,
      quantity: 2,
    },
  ] as Array<any>,
  clearLocalCart: vi.fn(),
  updateLocalQuantity: vi.fn(),
  removeLocalItem: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    cart: {
      getItems: { useQuery: () => ({ data: [], isLoading: false, refetch: vi.fn() }) },
      updateQuantity: { useMutation: () => ({ mutate: vi.fn() }) },
      removeItem: { useMutation: () => ({ mutate: vi.fn() }) },
      clear: { useMutation: () => ({ mutate: vi.fn() }) },
    },
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

vi.mock("@/hooks/useLocalCart", () => ({
  useLocalCart: () => ({
    cartItems: state.localCartItems,
    updateQuantity: state.updateLocalQuantity,
    removeItem: state.removeLocalItem,
    clearCart: state.clearLocalCart,
    getTotalPrice: () => state.localCartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  }),
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("sonner", () => ({ toast: { success: state.toastSuccess, error: vi.fn() } }));
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

import Cart from "./Cart";

describe("intégration panier invité", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.localCartItems = [
      { productId: 1, variantId: 102, name: "Vanilla Powder", sizeMl: 50, price: 12_000, quantity: 2 },
    ];
  });

  afterEach(() => cleanup());

  it("présente le total invité et relie le panier au checkout", () => {
    render(<Cart />);

    expect(screen.getByText("Vanilla Powder")).toBeTruthy();
    expect(screen.getAllByText("240,00 €")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Procéder au paiement" }).getAttribute("href")).toBe("/checkout");
  });

  it("vide le panier invité localement et confirme l’action", () => {
    render(<Cart />);

    fireEvent.click(screen.getByRole("button", { name: "Vider le panier" }));

    expect(state.clearLocalCart).toHaveBeenCalledTimes(1);
    expect(state.toastSuccess).toHaveBeenCalledWith("Panier vidé");
  });

  it("oriente un panier invité vide vers le catalogue", () => {
    state.localCartItems = [];
    render(<Cart />);

    expect(screen.getByText("Votre panier est vide")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Continuer vos achats" }).getAttribute("href")).toBe("/products");
    expect(screen.queryByRole("link", { name: "Procéder au paiement" })).toBeNull();
  });
});
