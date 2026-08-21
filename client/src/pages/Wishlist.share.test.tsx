// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WISHLIST_STORAGE_KEY } from "@shared/wishlist";

const mocks = vi.hoisted(() => ({
  share: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    products: {
      list: {
        useQuery: () => ({
          data: [
            { id: 20, name: "Vanilla Powder", price: 12000, volumeMl: 50, imageUrl: "/manus-storage/vanilla.jpg" },
            { id: 10, name: "Crystal Saffron", price: 12000, volumeMl: 50, imageUrl: "/manus-storage/crystal.jpg" },
          ],
          isLoading: false,
        }),
      },
    },
  },
}));
vi.mock("@shared/image-assets", () => ({ getProductImage: () => null }));
vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({ Link: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("sonner", () => ({ toast: mocks.toast }));

import Wishlist from "./Wishlist";

describe("liste de favoris — partage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "share", { configurable: true, value: mocks.share });
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([10]));
    window.history.replaceState({}, "", "/wishlist?selection=20,10");
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    window.history.replaceState({}, "", "/wishlist");
  });

  it("affiche une sélection reçue par lien sans modifier les favoris locaux", () => {
    render(<Wishlist />);

    expect(screen.getByText("Sélection partagée")).toBeTruthy();
    expect(screen.getByText("2 parfums dans cette sélection")).toBeTruthy();
    expect(screen.getByText("Vanilla Powder")).toBeTruthy();
    expect(screen.getByText("Crystal Saffron")).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]")).toEqual([10]);
  });

  it("partage exactement les parfums affichés par un lien portable", async () => {
    render(<Wishlist />);
    fireEvent.click(screen.getByRole("button", { name: "Partager la sélection" }));

    await Promise.resolve();
    expect(mocks.share).toHaveBeenCalledWith(expect.objectContaining({
      title: "Ma sélection Matière Première",
      url: "http://localhost:3000/wishlist?selection=20,10",
    }));
    expect(mocks.toast.success).toHaveBeenCalledWith("Sélection partagée.");
  });
});
