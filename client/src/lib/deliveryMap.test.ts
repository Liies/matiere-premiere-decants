import { describe, expect, it } from "vitest";
import {
  DELIVERY_MAP_DEFAULT_CENTER,
  DELIVERY_MAP_OPTIONS,
  formatDeliveryLocation,
} from "./deliveryMap";

describe("deliveryMap", () => {
  it("construit une adresse de géocodage dans un ordre stable sans segments vides", () => {
    expect(formatDeliveryLocation({
      address: "27 rue du Maroc",
      postalCode: "75019",
      city: "Paris",
      country: "France",
    })).toBe("27 rue du Maroc, 75019, Paris, France");

    expect(formatDeliveryLocation({
      address: "27 rue du Maroc",
      postalCode: "",
      city: "Paris",
      country: "France",
    })).toBe("27 rue du Maroc, Paris, France");
  });

  it("centralise la configuration de carte de confirmation", () => {
    expect(DELIVERY_MAP_DEFAULT_CENTER).toEqual({ lat: 46.6034, lng: 1.8883 });
    expect(DELIVERY_MAP_OPTIONS).toMatchObject({
      zoom: 5,
      disableDefaultUI: true,
      gestureHandling: "cooperative",
      keyboardShortcuts: false,
    });
  });
});
