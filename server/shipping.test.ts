import { describe, expect, it } from "vitest";
import { calculateOrderTotal, calculateShipping } from "../shared/shipping";

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

  it("conserve les frais France juste sous le seuil de gratuité", () => {
    const subtotalCents = 7999;
    const rate = calculateShipping("France", subtotalCents, "75019");

    expect(rate.appliedCostCents).toBe(495);
    expect(subtotalCents + rate.appliedCostCents).toBe(8494);
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

  it("conserve les frais Europe juste sous le seuil de gratuité", () => {
    const subtotalCents = 14999;
    const rate = calculateShipping("Belgique", subtotalCents);

    expect(rate.appliedCostCents).toBe(995);
    expect(subtotalCents + rate.appliedCostCents).toBe(15994);
  });

  it("applique le tarif Europe à tous les pays européens autorisés, y compris Monaco", () => {
    expect(calculateShipping("Norvège", 12000).appliedCostCents).toBe(995);
    expect(calculateShipping("Monaco", 12000)).toMatchObject({
      isFrance: false,
      isEurope: true,
      appliedCostCents: 995,
      freeShippingThresholdCents: 15000,
    });
  });

  it("ne propose pas le tarif France métropolitaine pour un code postal DOM-TOM", () => {
    const rate = calculateShipping("France", 12000, "97100");

    expect(rate.isFrance).toBe(false);
    expect(rate.isEurope).toBe(false);
    expect(rate.appliedCostCents).toBe(1995);
  });

  it("calcule le total final à partir du sous-total et du tarif réellement applicable", () => {
    expect(calculateOrderTotal({
      countryName: "France",
      postalCode: "75019",
      subtotalCents: 7900,
    })).toMatchObject({
      subtotalCents: 7900,
      shippingCostCents: 495,
      totalCents: 8395,
    });

    expect(calculateOrderTotal({
      countryName: "Belgique",
      postalCode: "1000",
      subtotalCents: 15000,
    })).toMatchObject({
      subtotalCents: 15000,
      shippingCostCents: 0,
      totalCents: 15000,
    });
  });
});
