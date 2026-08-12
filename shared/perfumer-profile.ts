export type PerfumeCredit = {
  house: string;
  name: string;
};

export const MASTER_PERFUMER_PROFILE = {
  name: "Aurélien Guichard",
  role: "Fondateur & Parfumeur de Matière Première",
  biography:
    "Parfumeur et fondateur de la maison, Aurélien Guichard imagine une écriture centrée sur une matière première exceptionnelle, révélée par une composition volontairement essentielle.",
  matierePremiereCreations: ["Radical Rose", "French Flower", "Crystal Saffron"],
  externalCreations: [
    { house: "Gucci", name: "Gucci Guilty" },
    { house: "Narciso Rodriguez", name: "Narciso" },
    { house: "Versace", name: "Eros" },
    { house: "Burberry", name: "Burberry Hero" },
  ] satisfies PerfumeCredit[],
  sources: {
    official: "https://matiere-premiere.com/en",
    interview:
      "https://cafleurebon.com/exclusive-interview-with-aurelien-guichard-of-matiere-premiere-and-sr-perfumer-at-takasago-maison-de-parfumeur-plus-giveaway/",
  },
} as const;
