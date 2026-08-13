import { describe, expect, it } from "vitest";
import { getProductStory, MATIERE_PREMIERE_PRODUCT_STORIES } from "../shared/product-stories";

const productSlugs = [
  "radical-rose",
  "falcon-leather",
  "santal-austral",
  "encens-suave",
  "bois-debene",
  "neroli-oranger",
  "cologne-cedrat",
  "crystal-safran",
  "vanille-powder",
  "parisian-musk",
  "french-flower",
];

describe("récits Matière Première", () => {
  it("associe un récit, une origine et une source officielle à chaque parfum proposé", () => {
    expect(Object.keys(MATIERE_PREMIERE_PRODUCT_STORIES)).toHaveLength(productSlugs.length);

    for (const slug of productSlugs) {
      const story = getProductStory(slug);
      expect(story).not.toBeNull();
      expect(story?.origin.length).toBeGreaterThan(3);
      expect(story?.story.length).toBeGreaterThan(80);
      expect(story?.sourceUrl).toMatch(/^https:\/\/matiere-premiere\.com\/en\/products\//);
    }
  });

  it("ne retourne pas de récit pour une référence sans source éditoriale", () => {
    expect(getProductStory("reference-inconnue")).toBeNull();
  });
});
