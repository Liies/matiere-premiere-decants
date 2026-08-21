/** @vitest-environment jsdom */

import React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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
              concentration: "extrait",
              price: 19500,
              stock: 5,
              imageUrl: "/manus-storage/vanilla-powder-test.png",
              variants: [
                { id: 101, productId: 1, sizeMl: 2, sku: "MP-VANPOW-02", priceCents: 1000, stock: 10, isActive: false, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
                { id: 102, productId: 1, sizeMl: 50, sku: "MP-VANPOW-50", priceCents: 12000, stock: 10, isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
              ],
            },
            {
              id: 2,
              name: "Crystal Saffron",
              description: "Un safran minéral.",
              topNotes: "Safran",
              heartNotes: "Ambroxan",
              baseNotes: "Cèdre",
              concentration: "edp",
              price: 19500,
              stock: 5,
              imageUrl: "/manus-storage/crystal-saffron-test.png",
              variants: [
                { id: 201, productId: 2, sizeMl: 2, sku: "MP-CRYSAF-02", priceCents: 1000, stock: 10, isActive: false, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
                { id: 202, productId: 2, sizeMl: 50, sku: "MP-CRYSAF-50", priceCents: 12000, stock: 0, isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
              ],
            },
          ],
          isLoading: false,
        }),
      },
    },
    cart: {
      addVariant: {
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
    window.history.replaceState({}, "", "/products");
  });

  it("affiche la confirmation sur la carte achetable et remplace les contrôles de la carte en rupture", () => {
    render(<Products />);

    const vanillaButton = screen.getByRole("button", { name: "Ajouter" });
    expect(screen.getByRole("link", { name: "Voir le parfum" })).toBeTruthy();
    expect(screen.queryByLabelText("Quantité de Crystal Saffron")).toBeNull();

    fireEvent.click(vanillaButton);

    expect(screen.getAllByRole("button", { name: "Ajouté" })).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Ajouter" })).toBeNull();
    expect(vanillaButton.textContent).toContain("Ajouté");
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

    expect(screen.getAllByRole("button", { name: "Ajouter" })).toHaveLength(1);
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

  it("affiche le prix unique du décant 50 ml avec le symbole euro après le montant", () => {
    render(<Products />);

    expect(screen.getByRole("img", { name: "Vanilla Powder" }).getAttribute("src")).toBe("/manus-storage/vanilla-powder-test.png");
    const vanillaPrice = screen.getByTestId("catalog-price-1");
    expect(vanillaPrice.textContent).toContain("120,00");
    expect(vanillaPrice.textContent?.indexOf("€")).toBeGreaterThan(vanillaPrice.textContent?.indexOf("120,00") ?? -1);
    expect(vanillaPrice.textContent).not.toContain("À partir de");

    expect(screen.getByTestId("catalog-card-body-1").className).toContain("h-full");
    expect(screen.getByTestId("catalog-card-actions-1").className).toContain("mt-auto");
  });

  it("rend une image exploitable pour chaque carte reçue du catalogue", () => {
    render(<Products />);

    const cards = document.querySelectorAll('[data-testid^="catalog-flip-card-"]');
    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(cards.length);
    images.forEach((image) => {
      expect(image.getAttribute("src")).toMatch(/^\/manus-storage\/.+/);
      expect(image.getAttribute("alt")).toBeTruthy();
    });
  });

  it("conserve un ajout unitaire compact sans afficher de quantité sur la carte", () => {
    render(<Products />);

    const grid = screen.getByTestId("catalog-products-grid");
    const actions = screen.getByTestId("catalog-card-actions-1");
    const vanillaCard = screen.getByTestId("catalog-card-body-1");
    const addButton = screen.getAllByRole("button", { name: "Ajouter" })[0]!;

    expect(grid.className).toContain("grid-cols-1");
    expect(grid.className).toContain("md:grid-cols-2");
    expect(actions.className).toContain("sm:items-end");
    expect(screen.queryByLabelText("Format de Vanilla Powder")).toBeNull();
    expect(screen.queryByLabelText("Quantité de Vanilla Powder")).toBeNull();
    expect(within(vanillaCard).getByText("Extrait de Parfum · Décant 50 ml")).toBeTruthy();
    expect(addButton.className).toContain("min-h-11");
    expect(addButton.className).toContain("w-full");
  });

  it("allège les filtres puisque le catalogue public est exclusivement proposé en 50 ml", () => {
    render(<Products />);

    expect(screen.queryByLabelText("Filtrer les parfums par contenance")).toBeNull();
    expect(screen.queryByText("Contenance")).toBeNull();
    expect(screen.getByText("Extrait de Parfum · Décant 50 ml")).toBeTruthy();
    expect(screen.getByText("Eau de Parfum · Décant 50 ml")).toBeTruthy();
    expect(screen.queryByRole("option", { name: /2 ml/ })).toBeNull();
  });

  it("présente les filtres dans une palette minérale claire et conserve leur remise à zéro", () => {
    render(<Products />);

    const filterModule = screen.getByTestId("catalog-olfactory-filters");
    expect(filterModule.className).toContain("bg-[#f8f7f3]");
    expect(filterModule.className).toContain("rounded-2xl");
    expect(screen.getByRole("heading", { name: "Explorez la collection par accords." })).toBeTruthy();
    expect(screen.getByText("Collection complète")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Filtrer par notes Boisé" }));

    expect(screen.getByText("1 accord sélectionné")).toBeTruthy();
    expect(screen.getByText("2 parfums correspondants")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Réinitialiser les filtres olfactifs" }));
    expect(screen.getByText("Collection complète")).toBeTruthy();
    expect(screen.getByText("2 parfums affichés")).toBeTruthy();
  });

  it("affiche une rupture claire sans contrôle d’achat pour un parfum temporairement indisponible", () => {
    render(<Products />);

    expect(screen.queryByRole("button", { name: "Afficher les disponibles" })).toBeNull();
    expect(screen.getByText("Rupture")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Voir le parfum" })).toBeTruthy();
    expect(screen.getByText("2 parfums affichés")).toBeTruthy();
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

  it("ouvre une suggestion avec la navigation applicative sans rechargement complet", () => {
    render(<Products />);

    const search = screen.getByRole("combobox", { name: "Rechercher un parfum par son nom" });
    fireEvent.focus(search);
    fireEvent.change(search, { target: { value: "Crystal" } });
    fireEvent.click(screen.getByRole("option", { name: /Crystal Saffron/ }));

    expect(window.location.pathname).toBe("/product/2");
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
