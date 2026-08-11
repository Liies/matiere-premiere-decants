import { describe, expect, it } from "vitest";
import { formatPrice } from "../shared/price";

describe("formatPrice", () => {
  it("formate les centimes en prix français cohérent avec le catalogue", () => {
    expect(formatPrice(8500)).toBe("85,00 €");
    expect(formatPrice(9500)).toBe("95,00 €");
  });
});
