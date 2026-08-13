export type PlaceAddressComponent = {
  long_name: string;
  types: readonly string[];
};

export type DeliveryAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

function getComponent(components: readonly PlaceAddressComponent[], type: string) {
  return components.find((component) => component.types.includes(type))?.long_name ?? "";
}

/** Transforme une réponse Places en données compatibles avec le formulaire de livraison. */
export function toDeliveryAddress(formattedAddress: string, components: readonly PlaceAddressComponent[]): DeliveryAddress {
  const streetNumber = getComponent(components, "street_number");
  const route = getComponent(components, "route");
  const address = [streetNumber, route].filter(Boolean).join(" ") || formattedAddress;
  const city = getComponent(components, "locality")
    || getComponent(components, "postal_town")
    || getComponent(components, "administrative_area_level_3");

  return {
    address,
    city,
    postalCode: getComponent(components, "postal_code"),
    country: getComponent(components, "country"),
  };
}
