// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
  archivedProducts: [{ id: 77, name: "Crystal Safran", concentration: "extrait", isArchived: true }],
  restoreProductMutate: vi.fn(),
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
  });

  it("affiche les indicateurs de commande et les alertes de stock réelles", () => {
    render(<Admin />);

    expect(screen.getByRole("heading", { name: /pilotage de la boutique/i })).toBeTruthy();
    expect(screen.getByText(/240,00/)).toBeTruthy();
    expect(screen.queryByText(/360,00/)).toBeNull();
    expect(screen.getByText(/panier moyen/i)).toBeTruthy();
    expect(screen.getByText(/1 paiement en attente/i)).toBeTruthy();
    expect(screen.getByText("Vanilla Powder")).toBeTruthy();
    expect(screen.getByText(/1 avis à modérer/i)).toBeTruthy();
    expect(screen.getAllByText(/stock à surveiller/i).length).toBeGreaterThan(0);
  });

  it("filtre les commandes sur les actions de préparation", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("button", { name: "À préparer" }));

    expect(screen.getByText("MP-PAID")).toBeTruthy();
    expect(screen.queryByText("MP-SHIPPED")).toBeNull();
  });

  it("filtre les commandes nécessitant une confirmation de paiement", () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("button", { name: "Paiements en attente" }));

    expect(screen.getByText("MP-PENDING")).toBeTruthy();
    expect(screen.queryByText("MP-PAID")).toBeNull();
    expect(screen.queryByText("MP-SHIPPED")).toBeNull();
  });

  it("affiche les archives et déclenche une restauration depuis le tableau de bord", () => {
    render(<Admin />);

    expect(screen.getByRole("heading", { name: "Produits archivés" })).toBeTruthy();
    expect(screen.getByText("Crystal Safran")).toBeTruthy();
    expect(screen.getByText(/extrait de parfum/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Restaurer" }));
    expect(state.restoreProductMutate).toHaveBeenCalledWith(
      { id: 77 },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });
});
