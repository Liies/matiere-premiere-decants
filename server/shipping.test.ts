import { describe, expect, it } from "vitest";
import { calculateShipping } from "../shared/shipping";

describe("Shipping calculation rules", () => {
  it("calculates standard shipping for France under threshold", () => {
    const rate = calculateShipping("France", 5000); // 50 €
    expect(rate.isFrance).toBe(true);
    expect(rate.isFree).toBe(false);
    expect(rate.appliedCostCents).toBe(495);
    expect(rate.carrier).toBe("Colissimo");
  });

  it("applies free shipping for France at or above 80 € threshold", () => {
    const rate = calculateShipping("France", 8000); // 80 €
    expect(rate.isFree).toBe(true);
    expect(rate.appliedCostCents).toBe(0);
  });

  it("calculates standard shipping for Europe under 150 € threshold", () => {
    const rate = calculateShipping("Belgique", 10000); // 100 €
    expect(rate.isEurope).toBe(true);
    expect(rate.isFrance).toBe(false);
    expect(rate.isFree).toBe(false);
    expect(rate.appliedCostCents).toBe(995);
  });

  it("applies free shipping for Europe at or above 150 € threshold", () => {
    const rate = calculateShipping("Espagne", 15000); // 150 €
    expect(rate.isFree).toBe(true);
    expect(rate.appliedCostCents).toBe(0);
  });
});
