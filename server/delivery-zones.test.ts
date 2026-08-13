import { describe, expect, it } from "vitest";
import { getDeliveryEligibility } from "../shared/delivery-zones";

describe("zones de livraison", () => {
  it("accepte la France métropolitaine et les pays européens", () => {
    expect(getDeliveryEligibility({ country: "France", postalCode: "75019" })).toMatchObject({
      eligible: true,
      territory: "metropolitan-france",
    });
    expect(getDeliveryEligibility({ country: "Belgique", postalCode: "1000" })).toMatchObject({
      eligible: true,
      territory: "europe",
    });
  });

  it("refuse les DOM-TOM et les pays hors Europe", () => {
    expect(getDeliveryEligibility({ country: "France", postalCode: "97200" })).toMatchObject({
      eligible: false,
      reason: expect.stringContaining("hors DOM-TOM"),
    });
    expect(getDeliveryEligibility({ country: "États-Unis", postalCode: "94105" })).toMatchObject({
      eligible: false,
      territory: "unsupported",
    });
  });
});
