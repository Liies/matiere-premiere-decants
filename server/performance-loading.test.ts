import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/HomePremium.tsx", import.meta.url), "utf8");
const authSource = readFileSync(new URL("../client/src/_core/hooks/useAuth.ts", import.meta.url), "utf8");
const documentSource = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");

describe("stratégies de chargement", () => {
  it("charge le quiz uniquement quand le visiteur le demande", () => {
    expect(homeSource).toContain('lazy(() => import("@/components/ScentQuizDialog"))');
    expect(homeSource).toContain("{isScentQuizOpen ? (");
  });

  it("priorise le hero et diffère les visuels éditoriaux hors écran", () => {
    expect(homeSource).toContain('fetchPriority="high"');
    expect(homeSource).toContain('loading="lazy"');
    expect(homeSource).toContain('fetchPriority="low"');
    expect(homeSource).toContain('decoding="async"');
  });

  it("évite les requêtes d’authentification répétées entre pages et prépare le CDN d’images", () => {
    expect(authSource).toContain("staleTime: 5 * 60 * 1000");
    expect(authSource).toContain("gcTime: 10 * 60 * 1000");
    expect(documentSource).toContain('rel="preconnect" href="https://d2xsxph8kpxj0f.cloudfront.net"');
  });
});
