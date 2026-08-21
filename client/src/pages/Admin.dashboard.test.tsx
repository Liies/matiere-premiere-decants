// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  orders: [
    {
      id: 1,
      orderNumber: "MP-PAID",
      status: "paid",
      totalAmount: 12000,
      customerName: "Lola",
      customerEmail: "lola@example.com",
      shippingAddress: "27 rue du Maroc",
      shippingPostalCode: "75019",
      shippingCity: "Paris",
      shippingCountry: "France",
      createdAt: new Date("2026-08-15T09:00:00Z"),
      items: [],
    },
    {
      id: 2,
      orderNumber: "MP-SHIPPED",
      status: "shipped",
      totalAmount: 12000,
      customerName: "Noah",
      customerEmail: "noah@example.com",
      shippingAddress: "10 rue de la Paix",
      shippingPostalCode: "75002",
      shippingCity: "Paris",
      shippingCountry: "France",
      createdAt: new Date("2026-08-16T09:00:00Z"),
      items: [],
    },
    {
      id: 3,
      orderNumber: "MP-PENDING",
      status: "awaiting_payment",
      totalAmount: 12000,
      customerName: "Aya",
      customerEmail: "aya@example.com",
      shippingAddress: "3 rue du Temple",
      shippingPostalCode: "75003",
      shippingCity: "Paris",
      shippingCountry: "France",
      createdAt: new Date("2026-08-17T09:00:00Z"),
      items: [],
    },
    {
      id: 4,
      orderNumber: "MP-OLD-PAID",
      status: "paid",
      totalAmount: 12000,
      customerName: "Mina",
      customerEmail: "mina@example.com",
      shippingAddress: "1 rue Montorgueil",
      shippingPostalCode: "75001",
      shippingCity: "Paris",
      shippingCountry: "France",
      createdAt: new Date("2026-07-01T09:00:00Z"),
      items: [],
    },
  ],
  lowStock: [{ id: 42, productId: 9, productName: "Vanilla Powder", sizeMl: 50, stock: 0 }],
  archivedProducts: [
    { id: 77, name: "Crystal Safran", concentration: "extrait", isArchived: true, archivedAt: new Date("2026-08-03T12:00:00Z") },
    { id: 78, name: "Archive 2", concentration: "edp", isArchived: true, archivedAt: new Date("2026-08-10T12:00:00Z") },
    { id: 79, name: "Archive 3", concentration: "edp", isArchived: true, archivedAt: new Date("2026-08-09T12:00:00Z") },
    { id: 80, name: "Archive 4", concentration: "edp", isArchived: true, archivedAt: new Date("2026-08-08T12:00:00Z") },
    { id: 81, name: "Archive 5", concentration: "edp", isArchived: true, archivedAt: new Date("2026-08-07T12:00:00Z") },
    { id: 82, name: "Archive 6", concentration: "edp", isArchived: true, archivedAt: new Date("2026-08-06T12:00:00Z") },
    { id: 83, name: "Archive 7", concentration: "edp", isArchived: true, archivedAt: new Date("2026-08-01T12:00:00Z") },
  ],
  restoreProductMutate: vi.fn(),
  deleteArchivedProductMutate: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    orders: {
      getAllOrders: { useQuery: () => ({ data: state.orders, isLoading: false, refetch: vi.fn() }) },
      updateStatus: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
    adminInventory: {
      lowStock: { useQuery: () => ({ data: state.lowStock, isLoading: false }) },
    },
    adminCatalog: {
      archived: { useQuery: () => ({ data: state.archivedProducts, isLoading: false }) },
      restore: { useMutation: () => ({ mutate: state.restoreProductMutate, isPending: false }) },
      deletePermanently: { useMutation: () => ({ mutate: state.deleteArchivedProductMutate, isPending: false }) },
    },
    reviews: {
      pending: { useQuery: () => ({ data: [{ id: 1 }], isLoading: false }) },
    },
    useUtils: () => ({
      adminCatalog: { archived: { invalidate: vi.fn() }, list: { invalidate: vi.fn() } },
      catalog: { list: { invalidate: vi.fn() } },
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

import Admin from "./Admin";

describe("tableau de bord administrateur", () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date("2026-08-17T12:00:00Z") }));
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    state.restoreProductMutate.mockClear();
    state.deleteArchivedProductMutate.mockClear();
  });

  it("affiche les indicateurs de commande et les alertes de stock réelles", () => {
    render(<Admin />);

    expect(screen.getByRole("heading", { name: /pilotage de la boutique/i })).toBeTruthy();
    expect(screen.getByText(/240,00/)).toBeTruthy();
    expect(screen.queryByText(/360,00/)).toBeNull();
    expect(screen.getByText(/panier moyen/i)).toBeTruthy();
    expect(screen.getByText("paiement à confirmer")).toBeTruthy();
    expect(screen.getByText("Vanilla Powder")).toBeTruthy();
    expect(screen.getByText("avis à modérer")).toBeTruthy();
    expect(screen.getAllByText(/stock à surveiller/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("admin-priority-queue")).toBeTruthy();
    expect(screen.getByTestId("admin-revenue-chart")).toBeTruthy();
    expect(screen.getByTestId("admin-order-status-chart")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Vue d’ensemble" }).getAttribute("aria-selected")).toBe("true");
  });

  it("filtre les commandes sur les actions de préparation", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("button", { name: /à préparer/ }));

    expect(screen.getByText("MP-PAID")).toBeTruthy();
    expect(screen.queryByText("MP-SHIPPED")).toBeNull();
    expect(screen.getByRole("tab", { name: "Commandes" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("button", { name: "À préparer" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("filtre les commandes nécessitant une confirmation de paiement", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("button", { name: /paiement à confirmer/ }));

    expect(screen.getByText("MP-PENDING")).toBeTruthy();
    expect(screen.queryByText("MP-PAID")).toBeNull();
    expect(screen.queryByText("MP-SHIPPED")).toBeNull();
  });

  it("sépare la confiance client du pilotage opérationnel pour limiter la densité d’information", () => {
    render(<Admin />);

    expect(screen.queryByRole("heading", { name: "Suivi des commandes" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Avis vérifiés à modérer" })).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "Confiance client" }));

    expect(screen.getByRole("heading", { name: "Avis vérifiés à modérer" })).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Suivi des commandes" })).toBeNull();
  });

  it("affiche les archives et déclenche une restauration depuis le tableau de bord", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("tab", { name: "Catalogue" }));
    expect(screen.getByRole("heading", { name: "Produits archivés" })).toBeTruthy();
    expect(screen.getByText("Crystal Safran")).toBeTruthy();
    expect(screen.getByText(/extrait de parfum/i)).toBeTruthy();

    const crystalRow = screen.getByText("Crystal Safran").closest("li");
    expect(crystalRow).toBeTruthy();
    fireEvent.click(within(crystalRow!).getByRole("button", { name: "Restaurer" }));
    expect(state.restoreProductMutate).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Restaurer ce parfum dans le catalogue ?" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Restaurer le parfum" }));
    expect(state.restoreProductMutate).toHaveBeenCalledWith(
      { id: 77 },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it("demande confirmation avant la suppression définitive et transmet uniquement l’archive ciblée", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("tab", { name: "Catalogue" }));
    const crystalRow = screen.getByText("Crystal Safran").closest("li");
    expect(crystalRow).toBeTruthy();
    fireEvent.click(within(crystalRow!).getByRole("button", { name: "Supprimer définitivement" }));

    expect(state.deleteArchivedProductMutate).not.toHaveBeenCalled();
    const confirmation = screen.getByRole("alertdialog");
    expect(within(confirmation).getByRole("heading", { name: "Supprimer définitivement ce parfum ?" })).toBeTruthy();
    fireEvent.click(within(confirmation).getByRole("button", { name: "Supprimer définitivement" }));
    expect(state.deleteArchivedProductMutate).toHaveBeenCalledWith(
      { id: 77 },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it("limite les archives à six références et permet de naviguer sans allonger la page", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("tab", { name: "Catalogue" }));

    expect(screen.getByText("Archive 6")).toBeTruthy();
    expect(screen.queryByText("Archive 7")).toBeNull();
    expect(screen.getByText("Affichage de 1 à 6 sur 7 archives")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

    expect(screen.getByText("Archive 7")).toBeTruthy();
    expect(screen.queryByText("Crystal Safran")).toBeNull();
    expect(screen.getByText("Page 2 sur 2")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Suivant" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("recherche un parfum archivé et recale la pagination sur les résultats trouvés", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("tab", { name: "Catalogue" }));
    fireEvent.change(screen.getByLabelText("Rechercher dans les produits archivés"), { target: { value: "safran" } });

    expect(screen.getByText("Crystal Safran")).toBeTruthy();
    expect(screen.queryByText("Archive 2")).toBeNull();
    expect(screen.getByText("1 résultat trouvé")).toBeTruthy();
    expect(screen.queryByRole("navigation", { name: "Pagination des produits archivés" })).toBeNull();

    fireEvent.change(screen.getByLabelText("Rechercher dans les produits archivés"), { target: { value: "inconnu" } });

    expect(screen.getByText("Aucun parfum archivé ne correspond à « inconnu »." )).toBeTruthy();
  });

  it("trie les archives par date d’archivage ou par nom sans modifier le filtre courant", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("tab", { name: "Catalogue" }));
    const archiveList = screen.getByText("Archive 2").closest("ul");
    expect(archiveList).toBeTruthy();
    expect(within(archiveList!).getAllByRole("listitem")[0].textContent).toContain("Archive 2");

    fireEvent.change(screen.getByLabelText("Trier les produits archivés"), { target: { value: "archived_asc" } });
    expect(within(archiveList!).getAllByRole("listitem")[0].textContent).toContain("Archive 7");

    fireEvent.change(screen.getByLabelText("Trier les produits archivés"), { target: { value: "name_desc" } });
    expect(within(archiveList!).getAllByRole("listitem")[0].textContent).toContain("Crystal Safran");
  });
});
