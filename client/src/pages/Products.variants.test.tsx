// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  addToLocalCart: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    products: {
      list: {
        useQuery: () => ({
          data: [{
            id: 10,
            name: "Test Variantes",
            description: "Une fragrance de test avec deux formats actifs.",
            topNotes: "Agrumes",
            heartNotes: "Iris",
            baseNotes: "Cèdre",
            price: 1000,
            imageUrl: "/manus-storage/test-variants.png",
            variants: [
              { id: 1001, productId: 10, sizeMl: 2, sku: "TEST-02", priceCents: 1000, stock: 5, isActive: true, sortOrder: 1 },
              { id: 1002, productId: 10, sizeMl: 50, sku: "TEST-50", priceCents: 12000, stock: 5, isActive: true, sortOrder: 2 },
            ],
          }],
          isLoading: false,
        }),
      },
    },
    cart: {
      addVariant: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));
vi.mock("@/hooks/useLocalCart", () => ({
  useLocalCart: () => ({ addToCart: state.addToLocalCart }),
}));
vi.mock("@shared/image-assets", () => ({ getProductImage: () => null }));
vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));

import Products from "./Products";

describe("catalogue — sélection de contenance", () => {
  beforeEach(() => state.addToLocalCart.mockClear());
  afterEach(() => cleanup());

  it("affiche le sélecteur seulement pour plusieurs formats et ajoute la variante choisie", () => {
    render(<Products />);

    const format = screen.getByLabelText("Format de Test Variantes") as HTMLSelectElement;
    expect(format.value).toBe("1001");
    expect(screen.getByText("2 contenances disponibles")).toBeTruthy();
    expect(screen.getByTestId("catalog-price-10").textContent).toContain("10,00");

    fireEvent.change(format, { target: { value: "1002" } });

    expect(screen.getByTestId("catalog-price-10").textContent).toContain("120,00");
    fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(state.addToLocalCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 10, name: "Test Variantes" }),
      expect.objectContaining({ id: 1002, sizeMl: 50, priceCents: 12000 }),
      1,
      { announce: false },
    );
  });
});
