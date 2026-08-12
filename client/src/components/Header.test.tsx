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

  it("reprend les mêmes entrées dans le menu mobile", () => {
    render(<Header />);

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));

    expect(screen.getAllByText("Accueil")).toHaveLength(2);
    expect(screen.getAllByText("Catalogue")).toHaveLength(2);
    expect(screen.getAllByText("Contact")).toHaveLength(2);
  });
});
