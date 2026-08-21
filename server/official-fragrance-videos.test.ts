import { describe, expect, it } from "vitest";
import { getOfficialFragranceVideo } from "@shared/official-fragrance-videos";

describe("vidéos officielles de parfums", () => {
  it("associe Vanilla Powder Extrait à sa publication officielle vérifiée", () => {
    expect(getOfficialFragranceVideo("vanilla-powder")).toEqual({
      title: "Vanilla Powder Extrait — film officiel",
      sourceUrl: "https://www.instagram.com/reel/DPwV4ozDnh_/",
      embedUrl: "https://www.instagram.com/reel/DPwV4ozDnh_/embed/captioned/",
    });
  });

  it("ne propose pas de vidéo lorsque la source officielle n’a pas été vérifiée", () => {
    expect(getOfficialFragranceVideo("encens-suave")).toBeUndefined();
    expect(getOfficialFragranceVideo(undefined)).toBeUndefined();
  });
});
