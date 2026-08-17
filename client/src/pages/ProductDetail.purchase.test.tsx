/** @vitest-environment jsdom */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const product = {
  id: 30017,
  brandId: 4,
  name: "Vanilla Powder",
  slug: "vanilla-powder",
  description: "Une vanille lumineuse et boisée.",
  topNotes: "Vanille",
  heartNotes: "",
  baseNotes: "Musc blanc",
  concentration: "extrait",
  price: 12_000,
  volumeMl: 50,
  imageUrl: "/manus-storage/vanilla-powder-extrait_a69128dc.jpg",
  brand: { name: "Matière Première", slug: "matiere-premiere" },
  variants: [
    { id: 1, productId: 30017, sizeMl: 2, sku: "MP-VANPOW-02", priceCents: 1_000, stock: 10, isActive: false, sortOrder: 1 },
    { id: 2, productId: 30017, sizeMl: 50, sku: "MP-VANPOW-50", priceCents: 12_000, stock: 3, isActive: true, sortOrder: 2 },
  ],
};

const productImageFixtures = [
  product,
  {
    ...product,
    id: 2,
    name: "Crystal Saffron",
    slug: "crystal-saffron",
    imageUrl: "/manus-storage/crystal-saffron-extrait_493b0085.jpg",
  },
  {
    ...product,
    id: 30019,
    name: "Parisian Musk",
    slug: "parisian-musk",
    concentration: "edp",
    imageUrl: "/manus-storage/parisian-musk-matiere-premiere_a554914c.webp",
  },
  {
    ...product,
    id: 30020,
    name: "French Flower",
    slug: "french-flower",
    concentration: "edp",
    imageUrl: "/manus-storage/french-flower-matiere-premiere_d8b4b81c.jpg",
  },
];

let productForTest = product;

vi.mock("@/lib/trpc", () => ({
  trpc: {
    cart: {
      addVariant: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      getItems: { useQuery: () => ({ data: [] }) },
    },
    products: {
      getById: { useQuery: () => ({ data: undefined, isLoading: false }) },
      getByBrandSlug: { useQuery: () => ({ data: productForTest, isLoading: false }) },
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
    ? [true, { brand: "matiere-premiere", slug: "vanilla-powder" }]
    : [false, undefined],
}));

import ProductDetail from "./ProductDetail";

describe("fiche de parfum — format public unique", () => {
  beforeEach(() => {
    productForTest = product;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
  });

  afterEach(() => cleanup());

  it("propose uniquement le décant actif de 50 ml et affiche ses informations d’achat", () => {
    render(<ProductDetail />);

    expect(screen.getByRole("img", { name: "Vanilla Powder" }).getAttribute("src")).toBe("/manus-storage/vanilla-powder-extrait_a69128dc.jpg");
    const summary = screen.getByTestId("product-purchase-summary");
    expect(summary.textContent ?? "").toMatch(/120,00\s*€/);
    expect(summary.textContent).toContain("50 ml · Format unique");
    expect(summary.textContent).toContain("En stock");
    expect(screen.getByText("Format unique")).toBeTruthy();
    expect(screen.getByText("Concentration")).toBeTruthy();
    expect(screen.getByText("Extrait de Parfum")).toBeTruthy();
    expect(screen.getByText("Livraison")).toBeTruthy();
    expect(screen.queryByText("Contenance disponible")).toBeNull();
    expect(screen.queryByRole("button", { name: /2 ml/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Ajouter au panier" }).getAttribute("disabled")).toBeNull();
  });

  it.each(productImageFixtures.map((fixture) => [fixture.name, fixture] as const))("rend une image exploitable pour la fiche %s", (_productName, productFixture) => {
    productForTest = productFixture;
    render(<ProductDetail />);

    const image = screen.getByRole("img", { name: productFixture.name });
    expect(image.getAttribute("src")).toMatch(/^\/manus-storage\/.+/);
    expect(image.getAttribute("alt")).toBe(productFixture.name);
  });
});
