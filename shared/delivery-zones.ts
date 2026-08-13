export type DeliveryDestination = {
  country: string;
  postalCode?: string;
};

export type DeliveryEligibility = {
  eligible: boolean;
  territory: "metropolitan-france" | "europe" | "unsupported" | "incomplete";
  reason?: string;
};

const EUROPEAN_COUNTRIES = new Set([
  "albania", "albanie", "andorra", "andorre", "armenia", "armenie", "austria", "autriche", "azerbaijan", "azerbaidjan",
  "belarus", "bielorussie", "belgium", "belgique", "bosnia and herzegovina", "bosnie herzegovine", "bulgaria", "bulgarie",
  "croatia", "croatie", "cyprus", "chypre", "czechia", "czech republic", "republique tcheque", "denmark", "danemark",
  "estonia", "estonie", "finland", "finlande", "georgia", "georgie", "germany", "allemagne", "greece", "grece",
  "hungary", "hongrie", "iceland", "islande", "ireland", "irlande", "italy", "italie", "kosovo", "latvia", "lettonie",
  "liechtenstein", "lithuania", "lituanie", "luxembourg", "malta", "malte", "moldova", "moldavie", "monaco",
  "montenegro", "netherlands", "pays bas", "north macedonia", "macedoine du nord", "norway", "norvege", "poland", "pologne",
  "portugal", "romania", "roumanie", "san marino", "serbia", "serbie", "slovakia", "slovaquie", "slovenia", "slovenie",
  "spain", "espagne", "sweden", "suede", "switzerland", "suisse", "turkiye", "turkey", "turquie", "ukraine",
  "united kingdom", "royaume uni", "great britain", "angleterre", "vatican", "vatican city",
]);

function normalize(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isMetropolitanFrancePostalCode(postalCode: string) {
  const normalizedPostalCode = postalCode.trim().replace(/\s/g, "");
  return !/^(97|98)/.test(normalizedPostalCode);
}

/** Politique métier : France métropolitaine et pays européens. */
export function getDeliveryEligibility(destination: DeliveryDestination): DeliveryEligibility {
  const country = normalize(destination.country);
  if (!country) {
    return { eligible: false, territory: "incomplete", reason: "Indiquez le pays de livraison." };
  }

  if (country === "france" || country === "france metropolitaine") {
    if (!destination.postalCode?.trim()) {
      return { eligible: false, territory: "incomplete", reason: "Indiquez le code postal pour vérifier la livraison en France." };
    }
    if (!isMetropolitanFrancePostalCode(destination.postalCode)) {
      return { eligible: false, territory: "unsupported", reason: "La livraison est disponible en France métropolitaine, hors DOM-TOM." };
    }
    return { eligible: true, territory: "metropolitan-france" };
  }

  if (EUROPEAN_COUNTRIES.has(country)) {
    return { eligible: true, territory: "europe" };
  }

  return { eligible: false, territory: "unsupported", reason: "La livraison est disponible en France métropolitaine et en Europe." };
}
