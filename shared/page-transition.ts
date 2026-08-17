export const PAGE_TRANSITION_DURATION_MS = 160;

const IMMEDIATE_PATHS = ["/cart", "/checkout"];
const COLLECTION_PATHS = ["/products", "/wishlist"];

export function shouldUseInstantPageTransition(pathname: string): boolean {
  return IMMEDIATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function isCollectionPageTransition(from: string, to: string): boolean {
  return from !== to && COLLECTION_PATHS.includes(from) && COLLECTION_PATHS.includes(to);
}
