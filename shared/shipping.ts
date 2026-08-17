import { getDeliveryEligibility } from "./delivery-zones";

export interface ShippingRate {
  country: string;
  isFrance: boolean;
  isEurope: boolean;
  costCents: number;
  freeShippingThresholdCents: number;
  isFree: boolean;
  appliedCostCents: number;
  estimatedDeliveryDays: string;
  carrier: string;
}

export interface OrderTotal {
  subtotalCents: number;
  shippingCostCents: number;
  totalCents: number;
  shipping: ShippingRate;
}

/**
 * Calcule le tarif de livraison à partir de la même politique de zones que le checkout.
 * Le code postal est nécessaire pour écarter les DOM-TOM du tarif France métropolitaine.
 */
export function calculateShipping(countryName: string, subtotalCents: number, postalCode?: string): ShippingRate {
  const normalized = (countryName || "").trim().toLowerCase();
  const isFranceLabel =
    normalized === "france" || 
    normalized === "france métropolitaine" ||
    normalized === "fr";
  const eligibility = getDeliveryEligibility({ country: countryName, postalCode });
  const isFrance = isFranceLabel && (!postalCode || eligibility.territory === "metropolitan-france");
  const isEurope = isFrance || eligibility.territory === "europe";

  if (isFrance) {
    const threshold = 8000; // 80.00 €
    const baseCost = 495; // 4.95 €
    const isFree = subtotalCents >= threshold;
    return {
      country: countryName || "France",
      isFrance: true,
      isEurope: true,
      costCents: baseCost,
      freeShippingThresholdCents: threshold,
      isFree,
      appliedCostCents: isFree ? 0 : baseCost,
      estimatedDeliveryDays: "2-3 jours ouvrés",
      carrier: "Colissimo"
    };
  }

  if (isEurope) {
    const threshold = 15000; // 150.00 €
    const baseCost = 995; // 9.95 €
    const isFree = subtotalCents >= threshold;
    return {
      country: countryName || "Europe",
      isFrance: false,
      isEurope: true,
      costCents: baseCost,
      freeShippingThresholdCents: threshold,
      isFree,
      appliedCostCents: isFree ? 0 : baseCost,
      estimatedDeliveryDays: "4-7 jours ouvrés",
      carrier: "Colissimo Europe"
    };
  }

  // Fallback or out of zone (though checkout blocks out-of-zone)
  return {
    country: countryName || "International",
    isFrance: false,
    isEurope: false,
    costCents: 1995,
    freeShippingThresholdCents: 30000,
    isFree: false,
    appliedCostCents: 1995,
    estimatedDeliveryDays: "7-15 jours",
    carrier: "Colissimo International"
  };
}

/** Calcule le total à régler en centimes depuis le sous-total et le tarif de livraison applicable. */
export function calculateOrderTotal({
  countryName,
  postalCode,
  subtotalCents,
}: {
  countryName: string;
  postalCode?: string;
  subtotalCents: number;
}): OrderTotal {
  const shipping = calculateShipping(countryName, subtotalCents, postalCode);
  const shippingCostCents = shipping.appliedCostCents;
  return {
    subtotalCents,
    shippingCostCents,
    totalCents: subtotalCents + shippingCostCents,
    shipping,
  };
}
