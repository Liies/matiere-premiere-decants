// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import About from "./About";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

afterEach(cleanup);

describe("page À propos — parfumeur", () => {
  it("présente Aurélien Guichard, sa biographie et ses créations Matière Première", () => {
    render(<About />);

    const profile = screen.getByTestId("about-perfumer-profile");
    expect(profile.textContent).toContain("Aurélien Guichard");
    expect(profile.textContent).toContain("Fondateur & Parfumeur de Matière Première");
    expect(profile.textContent).toContain("Radical Rose · French Flower · Crystal Saffron");
    expect(profile.textContent).toContain("matière première exceptionnelle");
  });

  it("affiche les repères de créations externes et des sources consultables", () => {
    render(<About />);

    expect(screen.getByText("Gucci Guilty")).toBeTruthy();
    expect(screen.getByText("Burberry Hero")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Matière Première" }).getAttribute("href")).toBe("https://matiere-premiere.com/en");
    expect(screen.getByRole("link", { name: "entretien avec Aurélien Guichard" }).getAttribute("href")).toContain("cafleurebon.com");
  });
});
