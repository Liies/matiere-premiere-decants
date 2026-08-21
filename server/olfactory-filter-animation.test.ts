import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("animation de sélection des filtres olfactifs", () => {
  it("anime uniquement un filtre activé et conserve un repli sans mouvement", () => {
    expect(stylesheet).toContain("@keyframes olfactoryFilterSelection");
    expect(stylesheet).toContain('.olfactory-filter-chip[data-state="on"]');
    expect(stylesheet).toContain("animation: olfactoryFilterSelection 360ms");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
