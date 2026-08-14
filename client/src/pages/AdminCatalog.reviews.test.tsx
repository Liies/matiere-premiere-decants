// @vitest-environment jsdom

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    adminCatalog: {
      list: { useQuery: () => ({ data: [], isLoading: false }) },
      update: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
    reviews: {
      pending: { useQuery: () => ({ data: [], isLoading: false }) },
      moderate: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
    useUtils: () => ({
      adminCatalog: { list: { invalidate: vi.fn() } },
      products: { list: { invalidate: vi.fn() }, getById: { invalidate: vi.fn() } },
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
  afterEach(() => cleanup());

  it("affiche un état vide honnête lorsqu’aucun avis vérifié ne requiert de modération", () => {
    render(<AdminCatalog />);

    expect(screen.getByRole("heading", { name: /avis à modérer/i })).toBeTruthy();
    expect(screen.getByText(/aucun avis en attente de modération/i)).toBeTruthy();
    expect(screen.getByText(/seuls les avis liés à une commande vérifiée/i)).toBeTruthy();
  });
});
