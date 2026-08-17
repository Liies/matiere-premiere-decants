// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
  ],
  lowStock: [{ id: 42, productId: 9, productName: "Vanilla Powder", sizeMl: 50, stock: 0 }],
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
    reviews: {
      pending: { useQuery: () => ({ data: [{ id: 1 }], isLoading: false }) },
    },
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
  afterEach(() => cleanup());

  it("affiche les indicateurs de commande et les alertes de stock réelles", () => {
    render(<Admin />);

    expect(screen.getByRole("heading", { name: /pilotage de la boutique/i })).toBeTruthy();
    expect(screen.getByText(/240,00/)).toBeTruthy();
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
});
