// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  addToCart: vi.fn(),
  addVariant: vi.fn(),
  toastSuccess: vi.fn(),
  mutationInput: null as { messages: Array<{ role: "user" | "assistant"; content: string }> } | null,
}));

const catalog = [{
  id: 1,
  slug: "vanilla-powder",
  name: "Vanilla Powder",
  imageUrl: null,
  price: 12000,
  brand: { slug: "matiere-premiere" },
  variants: [{ id: 10, sizeMl: 2, priceCents: 1000, stock: 8 }],
}];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    products: { list: { useQuery: () => ({ data: catalog }) } },
    advisor: {
      ask: {
        useMutation: () => ({
          isPending: false,
          mutate: (input: { messages: Array<{ role: "user" | "assistant"; content: string }> }, options: { onSuccess: (response: { reply: string; recommendations: Array<{ productSlug: string; reason: string; suggestedSizeMl: number }> }) => void }) => {
            state.mutationInput = input;
            options.onSuccess({
              reply: "Je vous propose une piste chaleureuse.",
              recommendations: [{ productSlug: "vanilla-powder", reason: "Une matière enveloppante.", suggestedSizeMl: 2 }],
            });
          },
        }),
      },
    },
    cart: { addVariant: { useMutation: () => ({ isPending: false, mutate: state.addVariant }) } },
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: false }) }));
vi.mock("@/hooks/useLocalCart", () => ({ useLocalCart: () => ({ addToCart: state.addToCart }) }));
vi.mock("@/hooks/useSEO", () => ({ useSEO: vi.fn() }));
vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("sonner", () => ({ toast: { success: state.toastSuccess, error: vi.fn() } }));
vi.mock("wouter", () => ({ Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }));
vi.mock("@/components/AIChatBox", () => ({
  AIChatBox: ({ onSendMessage }: { onSendMessage: (content: string) => void }) => (
    <button type="button" onClick={() => onSendMessage("Une vanille pas trop sucrée")}>Envoyer une demande</button>
  ),
}));

import Advisor from "./Advisor";

describe("intégration conseiller olfactif", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => cleanup());

  it("affiche une recommandation issue du catalogue et l'ajoute au panier invité", () => {
    render(<Advisor />);
    fireEvent.click(screen.getByRole("button", { name: "Envoyer une demande" }));

    expect(state.mutationInput?.messages[0]?.content).toBe("Une vanille pas trop sucrée");
    expect(screen.getByText("Vanilla Powder")).toBeTruthy();
    expect(screen.getByText("Une matière enveloppante.")).toBeTruthy();
    expect(screen.getByText("Décant 2 ml · 10,00 €")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(state.addToCart).toHaveBeenCalledWith(catalog[0], catalog[0].variants[0], 1);
  });
});
