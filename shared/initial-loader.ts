export const INITIAL_LOADER_SESSION_KEY = "mp-initial-loader-seen";
export const INITIAL_LOADER_VISIBLE_MS = 450;
export const INITIAL_LOADER_EXIT_MS = 180;

export function shouldShowInitialLoader(pathname: string, hasSeenLoader: boolean, hash = "") {
  return pathname === "/" && !hasSeenLoader && !hash;
}

export function getInitialAnchorTargetId(hash: string) {
  const target = hash.replace(/^#/, "").trim();
  return target.length > 0 ? target : null;
}
