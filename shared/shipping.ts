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

export function calculateShipping(countryName: string, subtotalCents: number): ShippingRate {
  const normalized = (countryName || "").trim().toLowerCase();
  
  const isFrance = 
    normalized === "france" || 
    normalized === "france métropolitaine" || 
    normalized === "monaco" || 
    normalized === "fr";

  // Europe countries (normalized)
  const europeCountries = [
    "allemagne", "germany", "belgique", "belgium", "espagne", "spain",
    "italie", "italy", "pays-bas", "netherlands", "suisse", "switzerland",
    "luxembourg", "portugal", "autriche", "austria", "irlande", "ireland",
    "royaume-uni", "united kingdom", "uk", "danemark", "denmark", "suède", "sweden",
    "finlande", "finland", "pologne", "poland", "grèce", "greece", "république tchèque", "czech republic"
  ];

  const isEurope = isFrance || europeCountries.some(c => normalized.includes(c));

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
