/** @vitest-environment jsdom */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
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
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("visuels éditoriaux de l’accueil", () => {
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

  it("présente les dix flacons dans le hero et l’atelier dans la section Notre Histoire", () => {
    render(<HomePremium />);

    expect(screen.getByAltText("Dix flacons de la collection Matière Première, composition éditoriale").getAttribute("src")).toBe(
      HOME_COLLECTION_EDITORIAL_IMAGE,
    );
    expect(screen.getByAltText("Atelier de création de Matière Première, matières et flacons de parfum").getAttribute("src")).toBe(
      HOME_STORY_ATELIER_IMAGE,
    );
  });
});
