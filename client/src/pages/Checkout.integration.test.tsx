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
  savedDeliveryAddress: null as any,
}));
const createOrderMutate = vi.fn();
const saveDeliveryAddressMutate = vi.fn();
const toastSpies = vi.hoisted(() => ({ error: vi.fn(), success: vi.fn() }));

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
    profile: {
      getDeliveryAddress: {
        useQuery: () => ({ data: state.savedDeliveryAddress, isLoading: false }),
      },
      saveDeliveryAddress: {
        useMutation: () => ({ mutate: saveDeliveryAddressMutate, isPending: false }),
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
vi.mock("@/components/AddressAutocomplete", () => ({
  default: ({ value, onValueChange, onAddressSelected }: any) => (
    <div>
      <input name="shippingAddress" value={value} onChange={(event) => onValueChange(event.target.value)} />
      <button
        type="button"
        onClick={() => onAddressSelected({
          address: "27 Rue du Maroc",
          city: "Paris",
          postalCode: "75019",
          country: "France",
        })}
      >
        Sélectionner 27 Rue du Maroc
      </button>
    </div>
  ),
}));
vi.mock("@/components/DeliveryLocationMap", () => ({ default: () => <div>Carte de confirmation</div> }));
vi.mock("sonner", () => ({ toast: toastSpies }));
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
    toastSpies.error.mockClear();
    toastSpies.success.mockClear();
    state.authenticated = true;
    state.cartItems = [{
      id: 1,
      productId: 1,
      quantity: 2,
      product: { id: 1, name: "Vanilla Powder", price: 8500 },
    }];
    state.savedDeliveryAddress = null;
    createOrderMutate.mockImplementation((_input, callbacks) => callbacks.onSuccess({
      success: true,
      orderNumber: "MP-TEST-CHECKOUT",
      orderId: 88,
    }));
    saveDeliveryAddressMutate.mockImplementation((_input, callbacks) => callbacks.onSuccess());
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
      items: [{ productId: 1, quantity: 2 }],
      totalAmount: 17_000,
    }), expect.any(Object));
    expect(screen.getByText("Commande confirmée !")).toBeTruthy();
    expect(screen.getByText("MP-TEST-CHECKOUT")).toBeTruthy();
  });

  it("renseigne ville, code postal et pays lorsqu’une adresse suggérée est sélectionnée", () => {
    const { container } = render(<Checkout />);

    fireEvent.click(screen.getByRole("button", { name: "Sélectionner 27 Rue du Maroc" }));

    expect(container.querySelector<HTMLInputElement>('input[name="shippingAddress"]')?.value).toBe("27 Rue du Maroc");
    expect(container.querySelector<HTMLInputElement>('input[name="shippingCity"]')?.value).toBe("Paris");
    expect(container.querySelector<HTMLInputElement>('input[name="shippingPostalCode"]')?.value).toBe("75019");
    expect(container.querySelector<HTMLInputElement>('input[name="shippingCountry"]')?.value).toBe("France");

    setInput(container, "shippingCity", "Pantin");
    expect(container.querySelector<HTMLInputElement>('input[name="shippingCity"]')?.value).toBe("Pantin");
  });

  it("réutilise l’adresse enregistrée et affiche la carte de confirmation", () => {
    state.savedDeliveryAddress = {
      address: "27 Rue du Maroc",
      city: "Paris",
      postalCode: "75019",
      country: "France",
    };
    const { container } = render(<Checkout />);

    fireEvent.click(screen.getByRole("button", { name: "Utiliser cette adresse" }));

    expect(container.querySelector<HTMLInputElement>('input[name="shippingAddress"]')?.value).toBe("27 Rue du Maroc");
    expect(screen.getByText("Cette adresse se trouve dans notre zone de livraison.")).toBeTruthy();
    expect(screen.getByText("Carte de confirmation")).toBeTruthy();
  });

  it("enregistre l’adresse choisie avant de confirmer la commande lorsque le client le demande", async () => {
    const { container } = render(<Checkout />);
    fireEvent.click(screen.getByRole("button", { name: "Sélectionner 27 Rue du Maroc" }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Enregistrer cette adresse/ }));
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => expect(saveDeliveryAddressMutate).toHaveBeenCalledWith({
      address: "27 Rue du Maroc",
      city: "Paris",
      postalCode: "75019",
      country: "France",
    }, expect.any(Object)));
    expect(createOrderMutate).toHaveBeenCalledTimes(1);
  });

  it("bloque la confirmation côté interface quand l’adresse est hors zone", () => {
    const { container } = render(<Checkout />);
    setInput(container, "shippingAddress", "1 Market Street");
    setInput(container, "shippingCity", "San Francisco");
    setInput(container, "shippingPostalCode", "94105");
    setInput(container, "shippingCountry", "États-Unis");

    expect(screen.getByText("La livraison est disponible en France métropolitaine et en Europe.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Confirmer la commande" }).hasAttribute("disabled")).toBe(true);
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

  it("protège le tunnel de commande lorsque le client n’est pas connecté", () => {
    state.authenticated = false;

    render(<Checkout />);

    expect(screen.getByText("Veuillez vous connecter pour continuer")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Confirmer la commande" })).toBeNull();
    expect(createOrderMutate).not.toHaveBeenCalled();
  });

  it("conserve le formulaire et signale une erreur si la création de commande échoue", async () => {
    createOrderMutate.mockImplementation((_input, callbacks) => callbacks.onError(new Error("Paiement indisponible")));
    const { container } = render(<Checkout />);
    setInput(container, "shippingAddress", "12 rue des Fleurs");
    setInput(container, "shippingCity", "Paris");
    setInput(container, "shippingPostalCode", "75001");
    setInput(container, "shippingCountry", "France");

    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => expect(toastSpies.error).toHaveBeenCalledWith("Paiement indisponible"));
    expect(screen.queryByText("Commande confirmée !")).toBeNull();
    expect(screen.getByRole("button", { name: "Confirmer la commande" })).toBeTruthy();
  });
});
