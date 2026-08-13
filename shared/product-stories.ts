export interface ProductStory {
  origin: string;
  title: string;
  story: string;
  detail: string;
  sourceUrl: string;
}

const OFFICIAL_STORE = "https://matiere-premiere.com/en/products";

export const MATIERE_PREMIERE_PRODUCT_STORIES: Record<string, ProductStory> = {
  "radical-rose": {
    origin: "Rose centifolia · Grasse, France",
    title: "La rose, prise à rebours",
    story: "Radical Rose part d’une absolue de rose centifolia issue de roses cultivées biologiquement par Matière Première à Grasse. L’immortelle de Croatie lui apporte une profondeur plus sèche, minérale et presque solaire.",
    detail: "Une rose qui ne cherche pas le velours convenu : elle se déploie, dense et lumineuse, avec une tension entre fleur fraîche et matière chaude.",
    sourceUrl: `${OFFICIAL_STORE}/radical-rose-extrait-de-parfum`,
  },
  "falcon-leather": {
    origin: "Goudron de bouleau · Finlande",
    title: "La trace végétale du cuir",
    story: "Falcon Leather est construit autour du goudron de bouleau de Finlande, une matière traditionnellement associée au tannage du cuir. La maison y voit un cuir à la fois net et souple, entre surface polie et facette daim.",
    detail: "Le résultat privilégie le relief : une chaleur fumée, une ligne boisée et une texture qui donne au cuir son mouvement.",
    sourceUrl: `${OFFICIAL_STORE}/falcon-leather-2`,
  },
  "santal-austral": {
    origin: "Huile de santal biologique · Australie",
    title: "Un bois blond qui dure",
    story: "Santal Austral met en scène une huile de santal biologique d’Australie. La composition s’attache à sa facette crémeuse, ample et lumineuse, pensée pour laisser un sillage enveloppant.",
    detail: "Une lecture de santal aux contours doux : moins décorative que tactile, plus proche d’une matière boisée chauffée par la peau.",
    sourceUrl: `${OFFICIAL_STORE}/santal-austral`,
  },
  "encens-suave": {
    origin: "Huile d’encens · Oman",
    title: "La résine, adoucie par la nuit",
    story: "Encens Suave s’ancre dans l’encens d’Oman. La maison le réchauffe par un accord de café et de vanille, pour faire basculer la résine vers une expression généreuse, sombre et addictive.",
    detail: "L’encens y conserve son vertical, mais il gagne une rondeur gourmande qui l’éloigne de l’austérité.",
    sourceUrl: `${OFFICIAL_STORE}/encens-suave`,
  },
  "bois-debene": {
    origin: "Huile de cabreuva · Brésil",
    title: "La profondeur du bois tropical",
    story: "Bois d’Ébène se développe autour de l’huile de cabreuva du Brésil. La maison compose avec des bois sombres et ambrés pour donner à la matière un grain dense et une chaleur texturée.",
    detail: "Un parfum de matière et de contraste, où le bois n’est pas lisse : il est sombre, sec par instants, puis doucement ambré.",
    sourceUrl: `${OFFICIAL_STORE}/bois-debene`,
  },
  "neroli-oranger": {
    origin: "Absolue de fleur d’oranger · Tunisie",
    title: "La fleur d’oranger au naturel",
    story: "Néroli Oranger s’inspire de l’odeur de la fleur d’oranger sur les arbres tunisiens. La matière centrale est une absolue de fleur d’oranger, choisie pour une expression florale claire, rayonnante et sensuelle.",
    detail: "La fraîcheur de l’agrume ouvre la voie à une fleur blanche qui garde son éclat, comme un jardin capturé à même l’air chaud.",
    sourceUrl: `${OFFICIAL_STORE}/neroli-oranger`,
  },
  "cologne-cedrat": {
    origin: "Huile de cédrat · Sicile, Italie",
    title: "Un agrume qui tient la distance",
    story: "Cologne Cédrat explore la fraîcheur presque épicée du zeste épais de cédrat sicilien. Matière Première imagine ici une cologne dont l’élan lumineux se prolonge bien au-delà des premières minutes.",
    detail: "Le cédrat y est moins jus que peau : vif, texturé et légèrement amer, prolongé par un fond discret.",
    sourceUrl: `${OFFICIAL_STORE}/cologne-cedrat`,
  },
  "crystal-safran": {
    origin: "Huile de safran · Grèce",
    title: "Le safran dans la lumière",
    story: "Crystal Safran place l’huile de safran de Grèce au centre de son écriture. La maison la décrit comme vive et lumineuse, en privilégiant une lecture cristalline de l’épice plutôt qu’un accord lourd.",
    detail: "Une matière de contraste : sa chaleur épicée reste traversée par une sensation claire, presque minérale.",
    sourceUrl: `${OFFICIAL_STORE}/crystal-saffron-2`,
  },
  "vanille-powder": {
    origin: "Absolue de vanille · Madagascar",
    title: "Le contraste noir et blanc",
    story: "Vanille Powder est construit autour de l’absolue de vanille de Madagascar. La maison joue un contraste entre une vanille profonde et une impression blanche, poudrée, qui allège sa gourmandise.",
    detail: "La vanille n’est pas traitée comme un simple sucre : elle devient matière, ombre et lumière dans le même geste.",
    sourceUrl: `${OFFICIAL_STORE}/vanilla-powder`,
  },
  "parisian-musk": {
    origin: "Graine d’ambrette · Pérou",
    title: "Un musc végétal en ville",
    story: "Parisian Musk s’articule autour de la graine d’ambrette du Pérou, que Matière Première présente comme le seul musc végétal naturel. Le parfum revendique une ligne fluide, minimaliste et urbaine.",
    detail: "Sa douceur n’est pas cotonneuse : elle est boisée, légèrement végétale, pensée comme une présence discrète et continue.",
    sourceUrl: `${OFFICIAL_STORE}/parisian-musc`,
  },
  "french-flower": {
    origin: "Tubéreuse · Grasse, France",
    title: "L’heure bleue dans les champs",
    story: "French Flower évoque le champ de la maison à Grasse lors des nuits fraîches de fin d’été. La tubéreuse française est travaillée sous forme d’absolue et d’enfleurage à partir des propres fleurs de Matière Première.",
    detail: "Une fleur blanche sans emphase, fraîche et lumineuse d’abord, puis plus sensuelle à mesure qu’elle se rapproche de la peau.",
    sourceUrl: `${OFFICIAL_STORE}/french-flower-3`,
  },
};

export function getProductStory(slug: string | null | undefined): ProductStory | null {
  if (!slug) return null;
  return MATIERE_PREMIERE_PRODUCT_STORIES[slug] ?? null;
}
