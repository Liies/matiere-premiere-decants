/** @vitest-environment jsdom */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const product = {
  id: 30017,
  brandId: 4,
  name: "Vanille Powder",
  slug: "vanille-powder",
  description: "Une vanille lumineuse et boisée.",
  topNotes: "Vanille",
  heartNotes: "",
  baseNotes: "Musc blanc",
  price: 12_000,
  volumeMl: 50,
  imageUrl: null,
  brand: { name: "Matière Première", slug: "matiere-premiere" },
  variants: [
    { id: 1, productId: 30017, sizeMl: 2, sku: "MP-VANPOW-02", priceCents: 1_000, stock: 10, isActive: false, sortOrder: 1 },
    { id: 2, productId: 30017, sizeMl: 50, sku: "MP-VANPOW-50", priceCents: 12_000, stock: 3, isActive: true, sortOrder: 2 },
  ],
};

vi.mock("@/lib/trpc", () => ({
  trpc: {
    cart: {
      addVariant: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      getItems: { useQuery: () => ({ data: [] }) },
    },
    products: {
      getById: { useQuery: () => ({ data: undefined, isLoading: false }) },
      getByBrandSlug: { useQuery: () => ({ data: product, isLoading: false }) },
      list: { useQuery: () => ({ data: [] }) },
    },
    reviews: {
      listPublished: { useQuery: () => ({ data: [], isLoading: false }) },
      eligibility: { useQuery: () => ({ data: { canSubmit: false, existingStatus: null } }) },
      create: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
    useUtils: () => ({
      cart: { getItems: { invalidate: vi.fn() } },
      reviews: { eligibility: { invalidate: vi.fn() } },
    }),
  },
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("@/hooks/useLocalCart", () => ({ useLocalCart: () => ({ addToCart: vi.fn() }) }));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: false }) }));
vi.mock("@/hooks/useWishlist", () => ({ useWishlist: () => ({ isWishlisted: () => false, toggleWishlist: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { info: vi.fn(), success: vi.fn(), error: vi.fn() } }));
vi.mock("wouter", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRoute: (route: string) => route === "/parfum/:brand/:slug"
    ? [true, { brand: "matiere-premiere", slug: "vanille-powder" }]
    : [false, undefined],
}));

import ProductDetail from "./ProductDetail";

describe("fiche de parfum — format public unique", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
  });

  afterEach(() => cleanup());

  it("propose uniquement le décant actif de 50 ml et affiche ses informations d’achat", () => {
    render(<ProductDetail />);

    const summary = screen.getByTestId("product-purchase-summary");
    expect(summary.textContent ?? "").toMatch(/120,00\s*€/);
    expect(summary.textContent).toContain("50 ml · Format unique");
    expect(summary.textContent).toContain("En stock");
    expect(screen.getByText("Format unique")).toBeTruthy();
    expect(screen.getByText("Livraison")).toBeTruthy();
    expect(screen.queryByText("Contenance disponible")).toBeNull();
    expect(screen.queryByRole("button", { name: /2 ml/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Ajouter au panier" }).getAttribute("disabled")).toBeNull();
  });
});
