export const INITIAL_LOADER_SESSION_KEY = "mp-initial-loader-seen";
export const INITIAL_LOADER_VISIBLE_MS = 900;
export const INITIAL_LOADER_EXIT_MS = 320;

export function shouldShowInitialLoader(pathname: string, hasSeenLoader: boolean) {
  return pathname === "/" && !hasSeenLoader;
}
