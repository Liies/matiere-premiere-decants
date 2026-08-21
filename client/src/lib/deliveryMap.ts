export type DeliveryLocation = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export const DELIVERY_MAP_DEFAULT_CENTER = { lat: 46.6034, lng: 1.8883 };

export const DELIVERY_MAP_OPTIONS = {
  zoom: 5,
  disableDefaultUI: true,
  gestureHandling: "cooperative" as const,
  keyboardShortcuts: false,
};

/** Produit l’adresse complète transmise au géocodeur à partir des champs de checkout. */
export function formatDeliveryLocation({ address, postalCode, city, country }: DeliveryLocation) {
  return [address, postalCode, city, country].filter(Boolean).join(", ");
}
