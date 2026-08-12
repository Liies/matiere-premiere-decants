export const HERO_NEXT_SECTION_ID = "story";

export function getHeroScrollBehavior(prefersReducedMotion: boolean): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}
