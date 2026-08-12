/** @vitest-environment jsdom */

import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  authenticated: true,
  cartItems: [
    {
      id: 1,
      productId: 1,
      quantity: 2,
      product: { id: 1, name: "Vanilla Powder", price: 8500 },
    },
  ] as Array<any>,
}));
const createOrderMutate = vi.fn();

vi.mock("@/lib/trpc", () => ({
  trpc: {
    cart: {
      getItems: {
        useQuery: () => ({ data: state.cartItems }),
      },
    },
    orders: {
      create: {
        useMutation: () => ({ mutate: createOrderMutate, isPending: false }),
      },
    },
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: state.authenticated,
    user: { name: "Camille Martin", email: "camille@example.com" },
  }),
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("wouter", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLocation: () => ["/checkout", vi.fn()],
}));

import Checkout from "./Checkout";

function setInput(container: HTMLElement, name: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  if (!input) throw new Error(`Champ ${name} introuvable`);
  fireEvent.change(input, { target: { value } });
}

describe("intégration checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.authenticated = true;
    state.cartItems = [{
      id: 1,
      productId: 1,
      quantity: 2,
      product: { id: 1, name: "Vanilla Powder", price: 8500 },
    }];
    createOrderMutate.mockImplementation((_input, callbacks) => callbacks.onSuccess({
      success: true,
      orderNumber: "MP-TEST-CHECKOUT",
      orderId: 88,
    }));
  });

  afterEach(() => cleanup());

  it("soumet un panier complet avec le montant calculé et confirme la commande", async () => {
    const { container } = render(<Checkout />);
    setInput(container, "shippingAddress", "12 rue des Fleurs");
    setInput(container, "shippingCity", "Paris");
    setInput(container, "shippingPostalCode", "75001");
    setInput(container, "shippingCountry", "France");

    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => expect(createOrderMutate).toHaveBeenCalledTimes(1));
    expect(createOrderMutate).toHaveBeenCalledWith(expect.objectContaining({
      customerName: "Camille Martin",
      customerEmail: "camille@example.com",
      items: [{ productId: 1, quantity: 2, unitPrice: 8500 }],
      totalAmount: 17_000,
    }), expect.any(Object));
    expect(screen.getByText("Commande confirmée !")).toBeTruthy();
    expect(screen.getByText("MP-TEST-CHECKOUT")).toBeTruthy();
  });

  it("empêche la création d’une commande lorsque le panier est vide", async () => {
    state.cartItems = [];
    const { container } = render(<Checkout />);
    setInput(container, "shippingAddress", "12 rue des Fleurs");
    setInput(container, "shippingCity", "Paris");
    setInput(container, "shippingPostalCode", "75001");
    setInput(container, "shippingCountry", "France");

    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => expect(createOrderMutate).not.toHaveBeenCalled());
  });
});
