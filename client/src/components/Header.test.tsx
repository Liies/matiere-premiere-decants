/** @vitest-environment jsdom */

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";
import { CART_STORAGE_KEY, CART_STORAGE_VERSION, LOCAL_CART_UPDATED_EVENT } from "@/hooks/useLocalCart";

const authState = vi.hoisted(() => ({
  isAuthenticated: false,
  user: null as { role: "admin" | "user" } | null,
  logout: vi.fn(),
}));

const cartState = vi.hoisted(() => ({
  items: [] as Array<{ quantity: number }>,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    cart: {
      getItems: {
        useQuery: () => ({ data: cartState.items }),
      },
    },
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    logout: authState.logout,
  }),
}));

describe("Header", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    window.history.replaceState({}, "", "/products");
    window.localStorage.clear();
    authState.isAuthenticated = false;
    authState.user = null;
    cartState.items = [];
    vi.clearAllMocks();
  });

  it("présente la navigation uniforme sans menu Par familles", () => {
    render(<Header />);

    expect(screen.queryByText("Par familles")).toBeNull();
    expect(screen.getByText("Accueil")).toBeTruthy();
    expect(screen.getByText("Catalogue")).toBeTruthy();
    expect(screen.getByText("À propos")).toBeTruthy();
    expect(screen.getByText("FAQ")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
  });

  it("marque la page active avec un indicateur animé dans la navigation", () => {
    render(<Header />);

    const catalogueLink = screen.getByRole("link", { name: "Catalogue" });
    expect(catalogueLink.getAttribute("aria-current")).toBe("page");
    expect(catalogueLink.className).toContain("after:scale-x-100");
    expect(catalogueLink.className).toContain("after:duration-500");

    const accueilLink = screen.getByRole("link", { name: "Accueil" });
    expect(accueilLink.getAttribute("aria-current")).toBeNull();
    expect(accueilLink.className).toContain("after:scale-x-0");
  });

  it("anime discrètement l’icône panier au survol tout en gardant un retour actif", () => {
    render(<Header />);

    const cartLink = screen.getByRole("link", { name: "Ouvrir le panier" });
    expect(cartLink.className).toContain("hover:-translate-y-0.5");
    expect(cartLink.className).toContain("active:scale-[0.97]");
    expect(cartLink.className).toContain("motion-reduce:transform-none");

    const cartIcon = cartLink.querySelector("svg");
    expect(cartIcon?.className.baseVal).toContain("group-hover:scale-110");
    expect(cartIcon?.className.baseVal).toContain("group-hover:-rotate-6");
  });

  it("affiche un compteur discret uniquement lorsque le panier contient des articles", async () => {
    render(<Header />);
    expect(screen.queryByTestId("header-cart-count")).toBeNull();

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      version: CART_STORAGE_VERSION,
      items: [
        { productId: 1, variantId: 11, sizeMl: 50, quantity: 2, name: "Vanilla Powder", price: 12000 },
        { productId: 2, variantId: 21, sizeMl: 50, quantity: 1, name: "Crystal Saffron", price: 12000 },
      ],
    }));
    window.dispatchEvent(new CustomEvent(LOCAL_CART_UPDATED_EVENT));

    const count = await screen.findByTestId("header-cart-count");
    expect(count.textContent).toBe("3");
    expect(count.getAttribute("aria-label")).toBe("3 articles dans votre panier");
    expect(screen.getByRole("link", { name: "Ouvrir le panier" }).className).toContain("relative");
  });

  it("reflète le nombre d’articles du panier connecté", () => {
    authState.isAuthenticated = true;
    authState.user = { role: "user" };
    cartState.items = [{ quantity: 2 }, { quantity: 1 }];

    render(<Header />);

    expect(screen.getByTestId("header-cart-count").textContent).toBe("3");
  });

  it("anime le logo sans perturber son accès à l’accueil", () => {
    render(<Header />);

    const brandLink = screen.getByRole("link", { name: "Accueil — Matière Première" });
    expect(brandLink.getAttribute("href")).toBe("/");

    const brand = screen.getByTestId("header-brand");
    expect(brand.className).toContain("group-hover:-translate-y-px");
    expect(brand.className).toContain("group-active:scale-[0.99]");
    expect(brand.className).toContain("motion-reduce:transform-none");

    const leaf = brand.querySelector("svg");
    expect(leaf?.className.baseVal).toContain("group-hover:rotate-[10deg]");
  });

  it("anime les actions Connexion et Déconnexion selon l’état de session", () => {
    render(<Header />);

    const loginLink = screen.getByRole("link", { name: "Connexion" });
    expect(loginLink.className).toContain("hover:-translate-y-px");
    expect(loginLink.className).toContain("active:scale-[0.97]");
    expect(loginLink.className).toContain("motion-reduce:transform-none");

    cleanup();
    authState.isAuthenticated = true;
    authState.user = { role: "user" };
    render(<Header />);

    const logoutButton = screen.getByRole("button", { name: "Déconnexion" });
    expect(logoutButton.className).toContain("hover:-translate-y-px");
    expect(logoutButton.className).toContain("hover:after:scale-x-100");
    expect(logoutButton.className).toContain("motion-reduce:after:transition-none");
  });

  it("reprend les mêmes entrées dans le menu mobile", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Ouvrir la liste de favoris" }).getAttribute("href")).toBe("/wishlist");
    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));

    expect(screen.getAllByText("Accueil")).toHaveLength(2);
    expect(screen.getAllByText("Catalogue")).toHaveLength(2);
    expect(screen.getAllByText("Contact")).toHaveLength(2);
    expect(screen.getByText("Liste de favoris")).toBeTruthy();
    expect(document.querySelectorAll('[aria-current="page"]')).toHaveLength(2);
  });
});
