export type ScentQuizQuestionId = "family" | "mood" | "intensity" | "occasion";
export type ScentQuizAnswers = Partial<Record<ScentQuizQuestionId, string>>;

type ScentTag =
  | "ambre"
  | "boise"
  | "cuire"
  | "equilibre"
  | "floral"
  | "frais"
  | "gourmand"
  | "intense"
  | "jour"
  | "musc"
  | "signature"
  | "soir"
  | "soft";

export type ScentQuizOption = {
  id: string;
  label: string;
  description: string;
  tags: ScentTag[];
};

export type ScentQuizQuestion = {
  id: ScentQuizQuestionId;
  eyebrow: string;
  prompt: string;
  options: ScentQuizOption[];
};

export type ScentQuizRecommendation = {
  name: string;
  slug: string;
  notes: string;
  description: string;
  reason: string;
  tags: ScentTag[];
  rank: number;
};

export const SCENT_QUIZ_QUESTIONS: ScentQuizQuestion[] = [
  {
    id: "family",
    eyebrow: "01 — L’accord",
    prompt: "Quelle facette vous attire le plus ?",
    options: [
      { id: "floral", label: "Un bouquet vivant", description: "Rose, fleur blanche, néroli", tags: ["floral", "soft"] },
      { id: "boise", label: "Un bois enveloppant", description: "Santal, cèdre, patchouli", tags: ["boise", "signature"] },
      { id: "ambre", label: "Une chaleur ambrée", description: "Résines, vanille, benjoin", tags: ["ambre", "gourmand"] },
      { id: "frais", label: "Un éclat frais", description: "Agrumes, thé, feuilles vertes", tags: ["frais", "jour"] },
    ],
  },
  {
    id: "mood",
    eyebrow: "02 — L’impression",
    prompt: "Quelle sensation recherchez-vous ?",
    options: [
      { id: "lumineux", label: "Lumineuse", description: "Clair, aérien, spontané", tags: ["frais", "floral", "jour"] },
      { id: "veloute", label: "Veloutée", description: "Douce, poudrée, addictive", tags: ["gourmand", "musc", "soft"] },
      { id: "mysterieux", label: "Mystérieuse", description: "Profonde, contrastée, racée", tags: ["ambre", "cuire", "intense"] },
    ],
  },
  {
    id: "intensity",
    eyebrow: "03 — Le sillage",
    prompt: "Comment souhaitez-vous le porter ?",
    options: [
      { id: "leger", label: "Près de la peau", description: "Un sillage discret et personnel", tags: ["soft", "musc"] },
      { id: "equilibre", label: "Avec équilibre", description: "Présent, mais tout en nuance", tags: ["equilibre", "signature"] },
      { id: "intense", label: "Avec présence", description: "Une empreinte qui reste en mémoire", tags: ["intense", "signature"] },
    ],
  },
  {
    id: "occasion",
    eyebrow: "04 — Le moment",
    prompt: "À quel moment l’imaginez-vous ?",
    options: [
      { id: "jour", label: "En journée", description: "Une signature fraîche et naturelle", tags: ["jour", "frais"] },
      { id: "soir", label: "Le soir", description: "Une présence plus enveloppante", tags: ["soir", "ambre", "intense"] },
      { id: "signature", label: "Comme une signature", description: "Un parfum qui vous accompagne partout", tags: ["signature", "equilibre"] },
    ],
  },
];

const RECOMMENDATIONS: ScentQuizRecommendation[] = [
  {
    name: "Cologne Cédrat",
    slug: "cologne-cedrat",
    notes: "Cédrat, bergamote, fleur d’oranger, musc blanc",
    description: "Un départ d’agrumes ciselé, prolongé par une douceur musquée très propre.",
    reason: "Une signature claire et lumineuse, pensée pour accompagner la journée avec naturel.",
    tags: ["frais", "jour", "soft", "musc", "equilibre"],
    rank: 1,
  },
  {
    name: "Néroli Oranger",
    slug: "neroli-oranger",
    notes: "Néroli, orange amère",
    description: "Une fleur d’oranger fraîche, éclatante et délicatement solaire.",
    reason: "Un choix instinctif si vous cherchez une fraîcheur florale sans surcharge.",
    tags: ["floral", "frais", "jour", "soft"],
    rank: 2,
  },
  {
    name: "Vanille Powder",
    slug: "vanille-powder",
    notes: "Vanille, poivre rose, notes poudrées, absolu de tonka",
    description: "Une vanille mate et cotonneuse, plus tendre que sucrée.",
    reason: "Son sillage doux compose une présence intime, réconfortante et très tactile.",
    tags: ["gourmand", "musc", "soft", "jour"],
    rank: 3,
  },
  {
    name: "French Flower",
    slug: "french-flower",
    notes: "Tubéreuse, thé chinois, fleur d’oranger, ambroxan",
    description: "Une tubéreuse contemporaine, fraîche et structurée par le thé.",
    reason: "Une florale singulière qui devient facilement une signature personnelle.",
    tags: ["floral", "soft", "equilibre", "signature"],
    rank: 4,
  },
  {
    name: "Parisian Musk",
    slug: "parisian-musk",
    notes: "Figuier, ambrette, ambroxan, cèdre, musc blanc",
    description: "Un musc de peau boisé, très moderne, traversé par la feuille de figuier.",
    reason: "Il prolonge votre présence avec discrétion, dans un registre propre et raffiné.",
    tags: ["musc", "boise", "soft", "equilibre", "signature"],
    rank: 5,
  },
  {
    name: "Santal Austral",
    slug: "santal-austral",
    notes: "Bois de santal, amande, iris, benjoin, fève tonka",
    description: "Un santal crémeux et lumineux, adouci par l’amande et l’iris.",
    reason: "Un bois enveloppant, équilibré et naturellement élégant du matin au soir.",
    tags: ["boise", "ambre", "gourmand", "soft", "equilibre", "signature"],
    rank: 6,
  },
  {
    name: "Bois d’Ébène",
    slug: "bois-debene",
    notes: "Poivre, citron, cèdre, iris, patchouli, vanille",
    description: "Un bois sombre éclairé par le poivre et le citron, avec une facette veloutée.",
    reason: "Un choix structuré pour qui aime les sillages boisés, précis et personnels.",
    tags: ["boise", "gourmand", "equilibre", "signature"],
    rank: 7,
  },
  {
    name: "Radical Rose",
    slug: "radical-rose",
    notes: "Rose centifolia, safran, ciste labdanum, patchouli, vanille",
    description: "Une rose de Grasse dense, rendue plus vibrante par le safran et les résines.",
    reason: "Une florale de caractère, conçue pour celles et ceux qui assument un sillage affirmé.",
    tags: ["floral", "ambre", "intense", "signature", "soir"],
    rank: 8,
  },
  {
    name: "Crystal Saffron",
    slug: "crystal-safran",
    notes: "Safran, rose, ambroxan, encens, cuir, musc",
    description: "Un safran brillant et minéral, porté par l’ambroxan et l’encens.",
    reason: "Une proposition contrastée pour une présence magnétique, entre épices et minéralité.",
    tags: ["ambre", "cuire", "musc", "intense", "signature", "soir"],
    rank: 9,
  },
  {
    name: "Encens Suave",
    slug: "encens-suave",
    notes: "Café, encens d’Oman, ciste, vanille, benjoin, ambre",
    description: "Un encens gourmand, profond et résineux, réchauffé par le café et la vanille.",
    reason: "Son enveloppe ambrée et intense trouve tout son relief en soirée.",
    tags: ["ambre", "gourmand", "intense", "soir"],
    rank: 10,
  },
  {
    name: "Falcon Leather",
    slug: "falcon-leather",
    notes: "Safran, oud, bouleau, cuir, mousse, patchouli, vanille",
    description: "Un cuir fumé et racé, construit autour d’un oud sombre et d’épices précieuses.",
    reason: "La recommandation la plus audacieuse pour un sillage profond, mystérieux et durable.",
    tags: ["boise", "cuire", "ambre", "intense", "signature", "soir"],
    rank: 11,
  },
];

function getSelectedTags(answers: ScentQuizAnswers) {
  return SCENT_QUIZ_QUESTIONS.flatMap((question) =>
    question.options.find((option) => option.id === answers[question.id])?.tags ?? [],
  );
}

export function getScentQuizRecommendation(answers: ScentQuizAnswers) {
  const selectedTags = getSelectedTags(answers);
  const scored = RECOMMENDATIONS
    .map((recommendation) => ({
      recommendation,
      score: selectedTags.reduce(
        (total, tag) => total + (recommendation.tags.includes(tag) ? 1 : 0),
        0,
      ),
    }))
    .sort((left, right) => right.score - left.score || left.recommendation.rank - right.recommendation.rank);

  return {
    recommendation: scored[0]!.recommendation,
    alternatives: scored.slice(1, 3).map(({ recommendation }) => recommendation),
  };
}
