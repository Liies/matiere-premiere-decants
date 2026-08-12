import { describe, expect, it } from "vitest";
import {
  getInitialAnchorTargetId,
  INITIAL_LOADER_EXIT_MS,
  INITIAL_LOADER_VISIBLE_MS,
  shouldShowInitialLoader,
} from "../shared/initial-loader";

describe("initial loader", () => {
  it("ne se présente qu’au premier accès à l’accueil", () => {
    expect(shouldShowInitialLoader("/", false)).toBe(true);
    expect(shouldShowInitialLoader("/", true)).toBe(false);
    expect(shouldShowInitialLoader("/products", false)).toBe(false);
    expect(shouldShowInitialLoader("/", false, "#craft")).toBe(false);
  });

  it("reste bref afin de ne pas freiner la navigation", () => {
    expect(INITIAL_LOADER_VISIBLE_MS).toBeLessThanOrEqual(1200);
    expect(INITIAL_LOADER_EXIT_MS).toBeLessThanOrEqual(400);
  });

  it("conserve les ancres d’accueil après la révélation", () => {
    expect(getInitialAnchorTargetId("#craft")).toBe("craft");
    expect(getInitialAnchorTargetId("#")).toBeNull();
  });
});
