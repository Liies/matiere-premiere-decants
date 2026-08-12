/** @vitest-environment jsdom */

import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Products from "./Products";
import { WISHLIST_STORAGE_KEY } from "@shared/wishlist";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    products: {
      list: {
        useQuery: () => ({
          data: [
            {
              id: 1,
              name: "Vanilla Powder",
              description: "Une vanille lumineuse.",
              topNotes: "Absolu de vanille",
              heartNotes: "Bois ambrés",
              baseNotes: "Musc blanc",
              price: 19500,
              stock: 5,
            },
            {
              id: 2,
              name: "Crystal Saffron",
              description: "Un safran minéral.",
              topNotes: "Safran",
              heartNotes: "Ambroxan",
              baseNotes: "Cèdre",
              price: 19500,
              stock: 5,
            },
          ],
          isLoading: false,
        }),
      },
    },
    cart: {
      addItem: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
    },
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

vi.mock("@/hooks/useLocalCart", () => ({
  useLocalCart: () => ({ addToCart: vi.fn() }),
}));

vi.mock("@shared/image-assets", () => ({
  getProductImage: () => null,
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));

describe("intégration catalogue — panier et souhaits", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("affiche la confirmation d’ajout uniquement sur la carte actionnée", () => {
    render(<Products />);

    fireEvent.click(screen.getAllByRole("button", { name: "Ajouter" })[0]!);

    expect(screen.getAllByRole("button", { name: "Ajouté" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Ajouter" })).toHaveLength(1);
  });

  it("renouvelle le délai de confirmation après deux ajouts rapprochés", () => {
    vi.useFakeTimers();
    render(<Products />);

    fireEvent.click(screen.getAllByRole("button", { name: "Ajouter" })[0]!);
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    fireEvent.click(screen.getByRole("button", { name: "Ajouté" }));
    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getAllByRole("button", { name: "Ajouté" })).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getAllByRole("button", { name: "Ajouter" })).toHaveLength(2);
  });

  it("bascule un cœur sans modifier le statut de souhait de l’autre carte", () => {
    render(<Products />);

    const vanillaHeart = screen.getByRole("button", {
      name: "Ajouter Vanilla Powder à la liste de souhaits",
    });
    const saffronHeart = screen.getByRole("button", {
      name: "Ajouter Crystal Saffron à la liste de souhaits",
    });

    fireEvent.click(vanillaHeart);

    expect(vanillaHeart.getAttribute("aria-pressed")).toBe("true");
    expect(saffronHeart.getAttribute("aria-pressed")).toBe("false");
    expect(JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]")).toEqual([1]);
  });
});
