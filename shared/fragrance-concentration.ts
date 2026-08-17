export type FragranceConcentration = "edt" | "edp" | "extrait" | "parfum" | "esprit" | "cologne";

const CONCENTRATION_LABELS: Record<FragranceConcentration, string> = {
  edt: "Eau de Toilette",
  edp: "Eau de Parfum",
  extrait: "Extrait de Parfum",
  parfum: "Parfum",
  esprit: "Esprit de Parfum",
  cologne: "Eau de Cologne",
};

export const CONCENTRATION_OPTIONS = Object.entries(CONCENTRATION_LABELS).map(([value, label]) => ({
  value: value as FragranceConcentration,
  label,
}));

export function getConcentrationLabel(concentration?: string | null) {
  return concentration && concentration in CONCENTRATION_LABELS
    ? CONCENTRATION_LABELS[concentration as FragranceConcentration]
    : null;
}
