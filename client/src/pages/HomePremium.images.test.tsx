/** @vitest-environment jsdom */

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePremium, {
  HOME_COLLECTION_EDITORIAL_IMAGE,
  HOME_STORY_ATELIER_IMAGE,
} from "./HomePremium";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

vi.mock("@/components/Header", () => ({ default: () => <header>Navigation</header> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Pied de page</footer> }));
vi.mock("@shared/home-hero", () => ({
  HERO_NEXT_SECTION_ID: "story",
  getHeroScrollBehavior: () => "auto",
}));
vi.mock("@shared/perfumer-profile", () => ({
  MASTER_PERFUMER_PROFILE: {
    name: "Aurélien Guichard",
    role: "Fondateur & Parfumeur",
    biography: "Profil de test.",
    matierePremiereCreations: ["Radical Rose"],
    externalCreations: [],
    sources: { official: "https://example.com", interview: "https://example.com" },
  },
}));
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
    fireEvent.click(screen.getByRole("button", { name: "Commencer l'Exploration" }));
    return screen.findByRole("dialog");
  }

  it("présente les dix flacons dans le hero et l’atelier dans la section Notre Histoire", () => {
    render(<HomePremium />);

    expect(screen.getByAltText("Dix flacons de la collection Matière Première, composition éditoriale").getAttribute("src")).toBe(
      HOME_COLLECTION_EDITORIAL_IMAGE,
    );
    expect(screen.getByAltText("Atelier de création de Matière Première, matières et flacons de parfum").getAttribute("src")).toBe(
      HOME_STORY_ATELIER_IMAGE,
    );
  });

  it("annonce le format 50 ml dans la promesse de collection", () => {
    render(<HomePremium />);

    expect(screen.getAllByText(/décants 50 ml/i)).toHaveLength(2);
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
