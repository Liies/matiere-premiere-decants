/** @vitest-environment jsdom */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let orders: Array<Record<string, unknown>> = [];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    orders: { getMyOrders: { useQuery: () => ({ data: orders, isLoading: false }) } },
    profile: { getDeliveryAddress: { useQuery: () => ({ data: null, isLoading: false }) } },
    auth: { logout: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) } },
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { email: "client@example.com" },
    isAuthenticated: true,
    logout: vi.fn(),
  }),
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));
vi.mock("wouter", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => <a href={href} className={className}>{children}</a>,
  useLocation: () => ["/account", vi.fn()],
}));

import Account from "./Account";

describe("espace client — suivi des commandes", () => {
  beforeEach(() => {
    orders = [];
  });

  afterEach(() => cleanup());

  it("propose le catalogue et le conseiller lorsqu’aucune commande n’existe", () => {
    render(<Account />);

    expect(screen.getByText("Votre historique apparaîtra ici")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Découvrir le catalogue" }).getAttribute("href")).toBe("/products");
    expect(screen.getByRole("link", { name: "Trouver mon parfum" }).getAttribute("href")).toBe("/conseil");
  });

  it("affiche un montant français et un statut explicite pour une commande", () => {
    orders = [{
      id: 1,
      orderNumber: "MP-101",
      status: "shipped",
      totalAmount: 12_000,
      createdAt: new Date("2026-08-15T00:00:00.000Z"),
      shippingAddress: "27 rue du Maroc",
      shippingPostalCode: "75019",
      shippingCity: "Paris",
      shippingCountry: "France",
      items: [{ id: 1, productName: "Vanille Powder", sizeMl: 50, quantity: 1 }],
    }];

    render(<Account />);

    expect(screen.getByText("Commande MP-101")).toBeTruthy();
    expect(screen.getByLabelText("Statut de commande : Expédiée")).toBeTruthy();
    expect(screen.getByText(/120,00/)).toBeTruthy();
    expect(screen.getByText("Vanille Powder — 50 ml x 1")).toBeTruthy();
  });
});
