import { describe, expect, it } from "vitest";
import { truncateDescription } from "@shared/seo";

describe("SEO Shared Utils — truncateDescription", () => {
  it("handles short text without change", () => {
    const text = "Parfum de niche d'exception.";
    expect(truncateDescription(text, 155)).toBe(text);
  });

  it("truncates long text on word boundary with ellipsis", () => {
    const longText = "Une vanille addictive et sensuelle créée autour d'absolu de vanille de Madagascar avec des notes de coco et d'orchidée pour un sillage inoubliable et luxueux.";
    const result = truncateDescription(longText, 60);
    expect(result.length).toBeLessThanOrEqual(61); // 60 + '…'
    expect(result.endsWith("…")).toBe(true);
    // Should not break in the middle of a word
    expect(result).not.toContain("inoubliabl…");
  });

  it("handles empty string and whitespace cleanly", () => {
    expect(truncateDescription("")).toBe("");
    expect(truncateDescription("   ")).toBe("");
  });

  it("handles accented characters correctly", () => {
    const text = "Élégance française, décants de parfums précieux.";
    expect(truncateDescription(text, 100)).toBe(text);
  });
});
