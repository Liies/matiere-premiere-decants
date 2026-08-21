/** @vitest-environment jsdom */

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
  }),
}));

describe("Header", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    window.history.replaceState({}, "", "/products");
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

  it("reprend les mêmes entrées dans le menu mobile", () => {
    render(<Header />);

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));

    expect(screen.getAllByText("Accueil")).toHaveLength(2);
    expect(screen.getAllByText("Catalogue")).toHaveLength(2);
    expect(screen.getAllByText("Contact")).toHaveLength(2);
    expect(document.querySelectorAll('[aria-current="page"]')).toHaveLength(2);
  });
});
