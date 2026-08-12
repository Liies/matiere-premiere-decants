import { describe, expect, it } from "vitest";
import { getOlfactoryFilterIdFromHash } from "../shared/catalog-category-route";

describe("catalog category route", () => {
  it("résout uniquement les familles olfactives connues", () => {
    expect(getOlfactoryFilterIdFromHash("#boise")).toBe("boise");
    expect(getOlfactoryFilterIdFromHash("floral")).toBe("floral");
    expect(getOlfactoryFilterIdFromHash("#inconnu")).toBeNull();
  });
});
