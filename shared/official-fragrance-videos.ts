export type OfficialFragranceVideo = {
  title: string;
  sourceUrl: string;
  embedUrl: string;
};

const OFFICIAL_FRAGRANCE_VIDEOS: Record<string, OfficialFragranceVideo> = {
  "vanilla-powder": {
    title: "Vanilla Powder Extrait — film officiel",
    sourceUrl: "https://www.instagram.com/reel/DPwV4ozDnh_/",
    embedUrl: "https://www.instagram.com/reel/DPwV4ozDnh_/embed/captioned/",
  },
  "crystal-saffron": {
    title: "Crystal Saffron Extrait — film officiel",
    sourceUrl: "https://www.instagram.com/reel/DNu86xl0LJ-/",
    embedUrl: "https://www.instagram.com/reel/DNu86xl0LJ-/embed/captioned/",
  },
};

export function getOfficialFragranceVideo(productSlug: string | undefined) {
  return productSlug ? OFFICIAL_FRAGRANCE_VIDEOS[productSlug] : undefined;
}
