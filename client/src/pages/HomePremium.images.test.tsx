/** @vitest-environment jsdom */

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePremium, {
  HOME_COLLECTION_EDITORIAL_IMAGE,
} from "./HomePremium";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("accueil premium — visuels et quiz", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  async function openQuiz() {
    fireEvent.click(screen.getByRole("button", { name: /Commencer l[’']Exploration/ }));
    return screen.findByRole("dialog");
  }

  it("présente la collection avec un seul visuel éditorial", () => {
    render(<HomePremium />);

    expect(screen.getByAltText("Six flacons Matière Première présentés sur des socles minéraux").getAttribute("src")).toBe(
      HOME_COLLECTION_EDITORIAL_IMAGE,
    );
    expect(screen.queryByText("Notre Histoire")).toBeNull();
    expect(screen.queryByText("Le savoir-faire")).toBeNull();
  });

  it("annonce le format 50 ml dans la promesse de collection", () => {
    render(<HomePremium />);

    expect(screen.getAllByText(/décants 50 ml/i)).toHaveLength(1);
  });

  it("donne les repères d’offre et un accès direct à la collection depuis le hero", () => {
    render(<HomePremium />);

    const reassurance = screen.getByTestId("home-offer-reassurance");
    expect(reassurance.textContent).toContain("Décant 50 ml");
    expect(reassurance.textContent).toContain("120,00 €");
    expect(reassurance.textContent).toContain("France & Europe");
    expect(screen.getByRole("link", { name: "Découvrir la collection" }).getAttribute("href")).toBe("/products");
    expect(screen.getByRole("link", { name: "Voir les 10 parfums" }).getAttribute("href")).toBe("/products");
  });

  it("ouvre le quiz de recommandation depuis le CTA Commencer l’Exploration", async () => {
    render(<HomePremium />);

    await openQuiz();

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Quelques gestes, une recommandation.")).toBeTruthy();
  });

  it("désactive la progression sans réponse et réinitialise le quiz à la fermeture", async () => {
    render(<HomePremium />);

    await openQuiz();
    const continueButton = screen.getByRole("button", { name: "Continuer" });
    expect(continueButton.hasAttribute("disabled")).toBe(true);

    fireEvent.click(screen.getByRole("radio", { name: /Un éclat frais/ }));
    expect(continueButton.hasAttribute("disabled")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).toBeNull();

    await openQuiz();
    expect(screen.getByText("1 / 4")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Continuer" }).hasAttribute("disabled")).toBe(true);
  });

  it("parcourt les préférences fraîches jusqu’à la recommandation Cologne Cédrat", async () => {
    render(<HomePremium />);

    await openQuiz();
    fireEvent.click(screen.getByRole("radio", { name: /Un éclat frais/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));
    fireEvent.click(screen.getByRole("radio", { name: /Lumineuse/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));
    fireEvent.click(screen.getByRole("radio", { name: /Près de la peau/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));
    fireEvent.click(screen.getByRole("radio", { name: /En journée/ }));
    fireEvent.click(screen.getByRole("button", { name: "Voir ma recommandation" }));

    expect(screen.getByTestId("scent-quiz-result")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Cologne Cédrat" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Découvrir ce parfum" }).getAttribute("href")).toBe(
      "/parfum/matiere-premiere/cologne-cedrat",
    );
  });

  it("permet de recommencer le quiz depuis le résultat sans conserver les réponses", async () => {
    render(<HomePremium />);

    await openQuiz();
    fireEvent.click(screen.getByRole("radio", { name: /Un éclat frais/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));
    fireEvent.click(screen.getByRole("radio", { name: /Lumineuse/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));
    fireEvent.click(screen.getByRole("radio", { name: /Près de la peau/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));
    fireEvent.click(screen.getByRole("radio", { name: /En journée/ }));
    fireEvent.click(screen.getByRole("button", { name: "Voir ma recommandation" }));

    fireEvent.click(screen.getByRole("button", { name: "Recommencer" }));

    expect(screen.queryByTestId("scent-quiz-result")).toBeNull();
    expect(screen.getByText("1 / 4")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Continuer" }).hasAttribute("disabled")).toBe(true);
  });
});
