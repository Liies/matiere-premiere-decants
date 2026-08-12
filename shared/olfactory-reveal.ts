export const OLFACTORY_REVEAL_STEP_MS = 140;

export const OLFACTORY_NOTE_ORDER = ["top", "heart", "base"] as const;

export function getOlfactoryRevealDelay(index: number) {
  return Math.max(0, index) * OLFACTORY_REVEAL_STEP_MS;
}
