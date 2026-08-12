/** @vitest-environment jsdom */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const stableProduct = {
  id: 30017,
  brandId: 4,
  name: "Vanille Powder",
  slug: "vanille-powder",
  description: "Vanille Powder se déploie autour de Vanille et Poivre rose.",
  topNotes: "Vanille, Poivre rose, Notes poudrées, Absolu de tonka",
  heartNotes: "",
  baseNotes: "",
  price: 12_000,
  volumeMl: 50,
  imageUrl: null,
  brand: { name: "Matière Première", slug: "matiere-premiere" },
  variants: [],
};

vi.mock("@/lib/trpc", () => ({
  trpc: {
    cart: {
      addVariant: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      getItems: { useQuery: () => ({ data: [] }) },
    },
    products: {
      getById: { useQuery: () => ({ data: undefined, isLoading: false }) },
      getByBrandSlug: { useQuery: () => ({ data: stableProduct, isLoading: false }) },
      list: { useQuery: () => ({ data: [] }) },
    },
    useUtils: () => ({ cart: { getItems: { invalidate: vi.fn() } } }),
  },
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("@/hooks/useLocalCart", () => ({ useLocalCart: () => ({ addToCart: vi.fn() }) }));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: true }) }));
vi.mock("@/hooks/useWishlist", () => ({ useWishlist: () => ({ isWishlisted: () => false, toggleWishlist: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { info: vi.fn(), error: vi.fn() } }));
vi.mock("wouter", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRoute: (route: string) => route === "/parfum/:brand/:slug"
    ? [true, { brand: "matiere-premiere", slug: "vanille-powder" }]
    : [false, undefined],
}));

import ProductDetail from "./ProductDetail";

describe("fiche de parfum à pyramide partielle", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
  });

  afterEach(() => cleanup());

  it("n’affiche pas les niveaux de cœur et de fond lorsqu’ils sont vides", () => {
    render(<ProductDetail />);

    expect(screen.getByText("Notes de tête")).toBeTruthy();
    expect(screen.queryByText("Notes de cœur")).toBeNull();
    expect(screen.queryByText("Notes de fond")).toBeNull();
    expect(screen.getByText(/référence en préparation/i)).toBeTruthy();
  });
});
