import { describe, expect, it } from "vitest";
import {
  getOlfactoryRevealDelay,
  OLFACTORY_NOTE_ORDER,
  OLFACTORY_REVEAL_STEP_MS,
} from "../shared/olfactory-reveal";

describe("olfactory notes reveal", () => {
  it("préserve la progression tête, cœur puis fond", () => {
    expect(OLFACTORY_NOTE_ORDER).toEqual(["top", "heart", "base"]);
  });

  it("applique une cadence brève et progressive", () => {
    expect(getOlfactoryRevealDelay(0)).toBe(0);
    expect(getOlfactoryRevealDelay(1)).toBe(OLFACTORY_REVEAL_STEP_MS);
    expect(getOlfactoryRevealDelay(2)).toBe(OLFACTORY_REVEAL_STEP_MS * 2);
    expect(getOlfactoryRevealDelay(-1)).toBe(0);
  });
});
