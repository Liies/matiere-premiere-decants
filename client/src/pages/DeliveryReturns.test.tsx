/** @vitest-environment jsdom */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => <a href={href} className={className}>{children}</a>,
}));

import DeliveryReturns from "./DeliveryReturns";

describe("livraison et retours", () => {
  afterEach(() => cleanup());

  it("affiche les conditions France et Europe ainsi que les liens de rétractation", () => {
    render(<DeliveryReturns />);

    expect(screen.getByRole("heading", { name: "Livraison et retours" })).toBeTruthy();
    expect(screen.getByText("France métropolitaine")).toBeTruthy();
    expect(screen.getByText("4,95 €")).toBeTruthy();
    expect(screen.getByText("Offerte dès 80,00 €")).toBeTruthy();
    expect(screen.getByText("Europe")).toBeTruthy();
    expect(screen.getByText("9,95 €")).toBeTruthy();
    expect(screen.getByText("Offerte dès 150,00 €")).toBeTruthy();
    expect(screen.getByText(/délai légal de 14 jours calendaires/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Nous contacter" }).getAttribute("href")).toBe("/contact");
    expect(screen.getByRole("link", { name: /service public/i }).getAttribute("href")).toContain("service-public.gouv.fr");
  });
});
