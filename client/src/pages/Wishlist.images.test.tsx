// @vitest-environment jsdom

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WISHLIST_STORAGE_KEY } from "@shared/wishlist";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    products: {
      list: {
        useQuery: () => ({
          data: [{
            id: 30017,
            name: "Vanilla Powder",
            price: 12000,
            volumeMl: 50,
            imageUrl: "/manus-storage/vanilla-powder-extrait_a69128dc.jpg",
          }],
          isLoading: false,
        }),
      },
    },
  },
}));
vi.mock("@shared/image-assets", () => ({
  getProductImage: () => ({ compressed: "/manus-storage/legacy-vanilla-bottle.png" }),
}));
vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({ Link: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

import Wishlist from "./Wishlist";

describe("liste de souhaits — visuels produit", () => {
  beforeEach(() => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([30017]));
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("privilégie le visuel produit actuel, comme le catalogue", () => {
    render(<Wishlist />);

    expect(screen.getByRole("img", { name: "Vanilla Powder" }).getAttribute("src"))
      .toBe("/manus-storage/vanilla-powder-extrait_a69128dc.jpg");
  });
});
