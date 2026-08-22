// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const localCart = vi.hoisted(() => vi.fn());

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ cart: { getItems: { invalidate: vi.fn() } } }),
    products: {
      list: {
        useQuery: () => ({
          data: [
            {
              id: 31,
              name: "Premier Parfum",
              description: "Une première fragrance disponible.",
              topNotes: "Bergamote",
              heartNotes: "Iris",
              baseNotes: "Musc",
              price: 12000,
              imageUrl: "/manus-storage/premier-parfum.png",
              variants: [{ id: 310, productId: 31, sizeMl: 50, sku: "FIRST-50", priceCents: 12000, stock: 4, isActive: true }],
            },
            {
              id: 32,
              name: "Second Parfum",
              description: "Une seconde fragrance disponible.",
              topNotes: "Poivre",
              heartNotes: "Rose",
              baseNotes: "Cèdre",
              price: 12000,
              imageUrl: "/manus-storage/second-parfum.png",
              variants: [{ id: 320, productId: 32, sizeMl: 50, sku: "SECOND-50", priceCents: 12000, stock: 4, isActive: true }],
            },
          ],
          isLoading: false,
        }),
      },
    },
    cart: {
      addVariant: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: false, user: null }) }));
vi.mock("@/hooks/useLocalCart", () => ({ useLocalCart: () => ({ addToCart: localCart }) }));
vi.mock("@shared/image-assets", () => ({ getProductImage: () => null }));
vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));

import Products from "./Products";

describe("catalogue — confirmation d’ajout ciblée", () => {
  afterEach(() => {
    cleanup();
    localCart.mockClear();
  });

  it("n’anime que la carte du parfum ajouté au panier", () => {
    render(<Products />);

    const firstCard = screen.getByTestId("catalog-card-body-31");
    const secondCard = screen.getByTestId("catalog-card-body-32");
    fireEvent.click(within(firstCard).getByRole("button", { name: "Ajouter" }));

    expect(within(firstCard).getByRole("button", { name: "Ajouté" })).toBeTruthy();
    expect(within(secondCard).getByRole("button", { name: "Ajouter" })).toBeTruthy();
    expect(firstCard.querySelector(".cart-added-ripple")).toBeTruthy();
    expect(secondCard.querySelector(".cart-added-ripple")).toBeNull();
  });
});
