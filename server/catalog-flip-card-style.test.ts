import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");
const flipBackRule = stylesheet.match(/\.catalog-flip-back\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

describe("verso olfactif des cartes catalogue", () => {
  it("reste immobile et ne crée pas de défilement interne", () => {
    expect(flipBackRule).toContain("overflow: hidden;");
    expect(flipBackRule).not.toContain("overflow-y: auto;");
    expect(stylesheet).toContain("height: 15.5rem;");
  });
});
