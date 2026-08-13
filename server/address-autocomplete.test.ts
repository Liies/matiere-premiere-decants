import { describe, expect, it } from "vitest";
import { toDeliveryAddress } from "../shared/address-autocomplete";

describe("conversion d’adresse Places", () => {
  it("extrait rue, ville, code postal et pays d’une adresse française", () => {
    const address = toDeliveryAddress("27 Rue du Maroc, 75019 Paris, France", [
      { long_name: "27", types: ["street_number"] },
      { long_name: "Rue du Maroc", types: ["route"] },
      { long_name: "Paris", types: ["locality", "political"] },
      { long_name: "75019", types: ["postal_code"] },
      { long_name: "France", types: ["country", "political"] },
    ]);

    expect(address).toEqual({
      address: "27 Rue du Maroc",
      city: "Paris",
      postalCode: "75019",
      country: "France",
    });
  });

  it("utilise l’adresse formatée et postal_town lorsque la voie ou locality est absente", () => {
    const address = toDeliveryAddress("SW1A 1AA London, Royaume-Uni", [
      { long_name: "London", types: ["postal_town"] },
      { long_name: "SW1A 1AA", types: ["postal_code"] },
      { long_name: "Royaume-Uni", types: ["country", "political"] },
    ]);

    expect(address).toEqual({
      address: "SW1A 1AA London, Royaume-Uni",
      city: "London",
      postalCode: "SW1A 1AA",
      country: "Royaume-Uni",
    });
  });
});
