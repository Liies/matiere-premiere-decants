export const PAGE_TRANSITION_DURATION_MS = 160;

const IMMEDIATE_PATHS = ["/cart", "/checkout"];

export function shouldUseInstantPageTransition(pathname: string): boolean {
  return IMMEDIATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
