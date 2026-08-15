/** @vitest-environment jsdom */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./pages/Products", () => ({ default: () => <main>Catalogue cible</main> }));
vi.mock("./hooks/useCartSyncOnSignIn", () => ({ useCartSyncOnSignIn: () => undefined }));
vi.mock("@/components/ui/sonner", () => ({ Toaster: () => null }));

import App from "./App";

describe("alias français du catalogue", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    window.sessionStorage.setItem("matiere-premiere-initial-loader-shown", "true");
    window.history.replaceState({}, "", "/catalogue");
  });

  afterEach(() => {
    cleanup();
    window.sessionStorage.clear();
  });

  it("redirectionne /catalogue vers /products sans afficher une page introuvable", async () => {
    render(<App />);

    expect(await screen.findByText("Catalogue cible")).toBeTruthy();
    expect(window.location.pathname).toBe("/products");
  });
});
