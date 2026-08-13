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

    const addButtons = screen.getAllByRole("button", { name: "Ajouter" });
    const vanillaButton = addButtons[0]!;
    const saffronButton = addButtons[1]!;

    fireEvent.click(vanillaButton);

    expect(screen.getAllByRole("button", { name: "Ajouté" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Ajouter" })).toHaveLength(1);
    expect(vanillaButton.textContent).toContain("Ajouté");
    expect(saffronButton.textContent).toContain("Ajouter");
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

  it("place les notes sur le verso retournable et permet de l’ouvrir au toucher", () => {
    render(<Products />);

    const vanillaFlipCard = screen.getByTestId("catalog-flip-card-1");
    expect(vanillaFlipCard.getAttribute("data-flipped")).toBe("false");
    expect(screen.getAllByText("Pyramide olfactive")).toHaveLength(2);
    expect(screen.queryByText("Notes de tête")).toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: "Afficher les notes" })[0]!);

    expect(vanillaFlipCard.getAttribute("data-flipped")).toBe("true");
    expect(screen.getByRole("button", { name: "Masquer les notes" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("affiche le prix avec le symbole euro après le montant et réserve une zone d’action distincte", () => {
    render(<Products />);

    const vanillaPrice = screen.getByTestId("catalog-price-1");
    expect(vanillaPrice.textContent).toContain("195,00");
    expect(vanillaPrice.textContent?.indexOf("€")).toBeGreaterThan(vanillaPrice.textContent?.indexOf("195,00") ?? -1);

    expect(screen.getByTestId("catalog-card-body-1").className).toContain("h-full");
    expect(screen.getByTestId("catalog-card-actions-1").className).toContain("mt-auto");
  });

  it("conserve des contrôles d’achat tactiles et séparés du contenu descriptif", () => {
    render(<Products />);

    const actions = screen.getByTestId("catalog-card-actions-1");
    const quantity = screen.getByLabelText("Quantité de Vanilla Powder");
    const addButton = screen.getAllByRole("button", { name: "Ajouter" })[0]!;

    expect(actions.className).toContain("sm:items-end");
    expect(quantity.className).toContain("h-11");
    expect(addButton.className).toContain("min-h-11");
  });

  it("filtre en temps réel, propose une suggestion, puis restaure la collection après une recherche vide", () => {
    render(<Products />);

    const search = screen.getByRole("combobox", { name: "Rechercher un parfum par son nom" });
    fireEvent.focus(search);
    fireEvent.change(search, { target: { value: "Crystal" } });

    expect(screen.getByRole("listbox", { name: "Suggestions de parfums" })).toBeTruthy();
    expect(screen.getByRole("option", { name: /Crystal Saffron/ })).toBeTruthy();
    expect(screen.getByText("1 parfum correspondant")).toBeTruthy();
    expect(screen.queryByText("Vanilla Powder")).toBeNull();

    fireEvent.change(search, { target: { value: "introuvable" } });
    expect(screen.getByText("Aucun parfum trouvé")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Voir toute la collection" }));
    expect((search as HTMLInputElement).value).toBe("");
    expect(screen.getByText("2 parfums affichés")).toBeTruthy();
    expect(screen.getByText("Vanilla Powder")).toBeTruthy();
  });

  it("attend 1,2 seconde de survol et annule le retournement si la souris quitte la carte", () => {
    vi.useFakeTimers();
    render(<Products />);

    const vanillaFlipCard = screen.getByTestId("catalog-flip-card-1");
    const vanillaCard = vanillaFlipCard.closest(".catalog-product-card");
    expect(vanillaCard).toBeTruthy();

    fireEvent.mouseEnter(vanillaCard!);
    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(vanillaFlipCard.getAttribute("data-hover-flipped")).toBe("false");

    fireEvent.mouseLeave(vanillaCard!);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(vanillaFlipCard.getAttribute("data-hover-flipped")).toBe("false");

    fireEvent.mouseEnter(vanillaCard!);
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(vanillaFlipCard.getAttribute("data-hover-flipped")).toBe("true");

    fireEvent.mouseLeave(vanillaCard!);
    expect(vanillaFlipCard.getAttribute("data-hover-flipped")).toBe("false");
  });
});
