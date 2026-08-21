// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  updateStockMutate: vi.fn(),
  updateProductMutate: vi.fn(),
  archiveProductMutate: vi.fn(),
  restoreProductMutate: vi.fn(),
  product: {
    id: 42,
    name: "Vanilla Powder",
    description: "Une description administrable suffisamment détaillée.",
    topNotes: "Absolu de vanille",
    heartNotes: "Bois ambrés",
    baseNotes: "Musc blanc",
    concentration: "extrait",
    price: 12000,
    volumeMl: 50,
  },
  variants: [{ id: 142, productId: 42, sizeMl: 50, stock: 3, isActive: true }],
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    adminCatalog: {
      list: { useQuery: () => ({ data: [state.product], isLoading: false }) },
      update: { useMutation: () => ({ mutate: state.updateProductMutate, isPending: false }) },
      archive: { useMutation: () => ({ mutate: state.archiveProductMutate, isPending: false }) },
      restore: { useMutation: () => ({ mutate: state.restoreProductMutate, isPending: false }) },
    },
    adminInventory: {
      variants: { useQuery: () => ({ data: state.variants, isLoading: false }) },
      updateStock: { useMutation: () => ({ mutate: state.updateStockMutate, isPending: false }) },
    },
    reviews: {
      pending: { useQuery: () => ({ data: [], isLoading: false }) },
      moderate: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
    useUtils: () => ({
      adminCatalog: { list: { invalidate: vi.fn() } },
      products: { list: { invalidate: vi.fn() }, getById: { invalidate: vi.fn() } },
      catalog: { list: { invalidate: vi.fn() } },
      adminInventory: { variants: { invalidate: vi.fn() } },
      reviews: { pending: { invalidate: vi.fn() } },
    }),
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: true, user: { id: 1, role: "admin" } }),
}));
vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("@/components/DashboardLayout", () => ({ default: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import AdminCatalog from "./AdminCatalog";

describe("administration des avis", () => {
  afterEach(() => {
    cleanup();
    state.updateStockMutate.mockClear();
    state.updateProductMutate.mockClear();
    state.archiveProductMutate.mockClear();
    state.restoreProductMutate.mockClear();
  });

  it("affiche un état vide honnête lorsqu’aucun avis vérifié ne requiert de modération", () => {
    render(<AdminCatalog />);

    expect(screen.getByTestId("admin-catalog-overview").textContent).toContain("1 actif");
    expect(screen.getByTestId("admin-catalog-overview").textContent).toContain("0 retirés");
    expect(screen.getByRole("heading", { name: /avis à modérer/i })).toBeTruthy();
    expect(screen.getByText(/aucun avis en attente de modération/i)).toBeTruthy();
    expect(screen.getByText(/seuls les avis liés à une commande vérifiée/i)).toBeTruthy();
  });

  it("affiche le stock actuel et transmet la nouvelle valeur de la variante au serveur", () => {
    render(<AdminCatalog />);

    expect(screen.getByRole("heading", { name: /stock disponible/i })).toBeTruthy();
    expect(screen.getByText(/stock actuel : 3 unités/i)).toBeTruthy();

    const stockInput = screen.getByLabelText("Nouveau stock") as HTMLInputElement;
    fireEvent.change(stockInput, { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: "Mettre à jour" }));

    expect(state.updateStockMutate).toHaveBeenCalledWith(
      { variantId: 142, stock: 8 },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it("charge et enregistre les notes de tête, de cœur et de fond", () => {
    render(<AdminCatalog />);

    expect((screen.getByLabelText("Notes de tête") as HTMLTextAreaElement).value).toBe("Absolu de vanille");
    expect((screen.getByLabelText("Notes de cœur") as HTMLTextAreaElement).value).toBe("Bois ambrés");
    expect((screen.getByLabelText("Notes de fond") as HTMLTextAreaElement).value).toBe("Musc blanc");

    fireEvent.change(screen.getByLabelText("Notes de tête"), { target: { value: "Poivre noir" } });
    fireEvent.change(screen.getByLabelText("Notes de cœur"), { target: { value: "Iris, ambroxan" } });
    fireEvent.change(screen.getByLabelText("Notes de fond"), { target: { value: "Bois de santal" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(state.updateProductMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 42,
        topNotes: "Poivre noir",
        heartNotes: "Iris, ambroxan",
        baseNotes: "Bois de santal",
      }),
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it("affiche et transmet la concentration exacte du parfum", () => {
    render(<AdminCatalog />);

    const concentration = screen.getByLabelText("Concentration") as HTMLSelectElement;
    expect(concentration.value).toBe("extrait");
    expect((screen.getByRole("option", { name: "Extrait de Parfum" }) as HTMLOptionElement).selected).toBe(true);

    fireEvent.change(concentration, { target: { value: "edp" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(state.updateProductMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 42, concentration: "edp" }),
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it("demande une confirmation avant de retirer un parfum du catalogue", () => {
    render(<AdminCatalog />);

    fireEvent.click(screen.getByRole("button", { name: "Retirer du catalogue" }));

    expect(screen.getByRole("alertdialog")).toBeTruthy();
    expect(screen.getByText(/ne supprime pas l’historique des commandes/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Retirer le parfum" }));

    expect(state.archiveProductMutate).toHaveBeenCalledWith(
      { id: 42 },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });
});
