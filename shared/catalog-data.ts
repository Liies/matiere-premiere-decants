export const LEGACY_CATALOG_PRICE_CENTS = 12_000;
export const DEFAULT_DECANT_SIZES_ML = [2, 5, 10] as const;

export type NoteLayer = "top" | "heart" | "base";
export type NoteFamily = "boise" | "floral" | "epice" | "gourmand" | "cuire" | "ambre" | "agrume" | "musc" | "aromatique" | "aquatique";
export type ProductStatus = "available" | "out_of_stock";
export type Concentration = "edt" | "edp" | "extrait" | "parfum" | "esprit" | "cologne";

export interface CatalogBrand {
  name: string;
  slug: string;
  tier: "niche" | "designer" | "exclusive";
  story: string;
  sortOrder: number;
}

export interface CatalogProduct {
  brandSlug: string;
  name: string;
  slug: string;
  concentration: Concentration;
  gender: "mixte";
  status: ProductStatus;
  description: string;
  notes: Record<NoteLayer, string[]>;
}

export interface StructuredNote {
  name: string;
  slug: string;
  family: NoteFamily;
  parentSlug?: string;
}

export const BRANDS: CatalogBrand[] = [
  { name: "Maison Francis Kurkdjian", slug: "maison-francis-kurkdjian", tier: "niche", story: "Créations de haute parfumerie contemporaines.", sortOrder: 10 },
  { name: "Armani Privé", slug: "armani-prive", tier: "designer", story: "Collection de parfumerie d'exception de Giorgio Armani.", sortOrder: 20 },
  { name: "Frédéric Malle", slug: "frederic-malle", tier: "niche", story: "Éditions de parfums composées par des nez indépendants.", sortOrder: 30 },
  { name: "Matière Première", slug: "matiere-premiere", tier: "niche", story: "Parfums construits autour d'une matière première centrale.", sortOrder: 40 },
  { name: "Guerlain", slug: "guerlain", tier: "designer", story: "Maison historique de haute parfumerie française.", sortOrder: 50 },
  { name: "Dior", slug: "dior", tier: "designer", story: "Collection de parfums de la maison Dior.", sortOrder: 60 },
  { name: "Tom Ford", slug: "tom-ford", tier: "designer", story: "Parfums signature aux accords contrastés.", sortOrder: 70 },
  { name: "Dolce & Gabbana", slug: "dolce-gabbana", tier: "designer", story: "Créations de la collection Velvet.", sortOrder: 80 },
  { name: "Kilian", slug: "kilian", tier: "niche", story: "Parfums inspirés de matières gourmandes et boisées.", sortOrder: 90 },
  { name: "Crivelli", slug: "crivelli", tier: "niche", story: "Compositions contrastées inspirées de voyages sensoriels.", sortOrder: 100 },
  { name: "Louis Vuitton", slug: "louis-vuitton", tier: "exclusive", story: "Collection de parfums de la maison Louis Vuitton.", sortOrder: 110 },
  { name: "Liquides Imaginaires", slug: "liquides-imaginaires", tier: "niche", story: "Parfums narratifs aux imaginaires singuliers.", sortOrder: 120 },
  { name: "Cartier", slug: "cartier", tier: "exclusive", story: "Créations de la maison Cartier.", sortOrder: 130 },
  { name: "Creed", slug: "creed", tier: "niche", story: "Maison de parfumerie aux créations emblématiques.", sortOrder: 140 },
];

const product = (
  brandSlug: string,
  name: string,
  slug: string,
  notes: Record<NoteLayer, string[]>,
  concentration: Concentration = "parfum",
  status: ProductStatus = "available",
): CatalogProduct => ({
  brandSlug,
  name,
  slug,
  concentration,
  gender: "mixte",
  status,
  description: (() => {
    const anchorNotes = notes.base.length > 0 ? notes.base : notes.heart.length > 0 ? notes.heart : notes.top;
    return anchorNotes.length > 0
      ? `${name} se déploie autour de ${anchorNotes.slice(0, 2).join(" et ")}.`
      : `${name}, une création à découvrir en décant.`;
  })(),
  notes,
});

export const MULTI_BRAND_CATALOG: CatalogProduct[] = [
  product("maison-francis-kurkdjian", "Oud Satin Mood", "oud-satin-mood", { top: ["Violette", "Bergamote"], heart: ["Rose", "Oud", "Violette"], base: ["Ambre", "Vanille", "Baies roses"] }, "extrait"),
  product("maison-francis-kurkdjian", "Oud Silk Mood", "oud-silk-mood", { top: ["Bergamote", "Camomille", "Rose bulgare"], heart: ["Hédione", "Bois de gaïac"], base: ["Oud", "Papyrus"] }, "extrait"),
  product("maison-francis-kurkdjian", "Gentle Fluidity Gold", "gentle-fluidity-gold", { top: ["Baies de genièvre", "Noix de muscade"], heart: ["Coriandre"], base: ["Musc", "Ambre", "Vanille", "Notes boisées"] }),
  product("maison-francis-kurkdjian", "Grand Soir", "grand-soir", { top: ["Ciste labdanum", "Orange"], heart: ["Benjoin Siam"], base: ["Ambre", "Cèdre", "Musc", "Tonka", "Vanille"] }),
  product("maison-francis-kurkdjian", "Oud", "oud", { top: ["Bergamote", "Rose", "Safran"], heart: ["Oud"], base: ["Encens", "Musc", "Vanille"] }, "extrait"),
  product("maison-francis-kurkdjian", "Baccarat Elixir", "baccarat-elixir", { top: ["Poivre rose", "Bergamote"], heart: ["Jasmin", "Ylang-ylang"], base: ["Ambre", "Vanille", "Bois de santal"] }),
  product("maison-francis-kurkdjian", "Absolu pour le Soir", "absolu-pour-le-soir", { top: ["Cumin"], heart: ["Rose", "Ylang-ylang", "Encens"], base: ["Benjoin", "Bois de santal", "Cèdre"] }),
  product("armani-prive", "Rouge Malachite", "rouge-malachite", { top: ["Tubéreuse"], heart: ["Fleurs blanches", "Ambre"], base: ["Notes crémeuses", "Notes sensuelles"] }),
  product("frederic-malle", "Musc Ravageur", "musc-ravageur", { top: ["Bergamote", "Mandarine"], heart: ["Épices", "Musc"], base: ["Vanille", "Bois de santal"] }),
  product("matiere-premiere", "Encens Suave", "encens-suave", { top: ["Café"], heart: ["Encens Oman", "Ciste"], base: ["Vanille", "Benjoin", "Ambre"] }, "extrait"),
  product("matiere-premiere", "Falcon Leather", "falcon-leather", { top: ["Bergamote", "Safran"], heart: ["Ciste labdanum"], base: ["Oud Assafi Bangladesh", "Benjoin", "Bouleau", "Cuir", "Mousse", "Patchouli", "Vanille"] }, "extrait"),
  product("matiere-premiere", "Radical Rose", "radical-rose", { top: ["Piment de baie", "Safran"], heart: ["Rose centifolia de Grasse"], base: ["Ciste labdanum", "Patchouli", "Vanille", "Immortelle"] }, "extrait"),
  product("matiere-premiere", "Santal Austral", "santal-austral", { top: ["Amande", "Iris"], heart: ["Bois de santal"], base: ["Benjoin", "Fève tonka", "Cardamome noire"] }, "extrait"),
  product("matiere-premiere", "Crystal Safran", "crystal-safran", { top: ["Fruits rouges", "Safran"], heart: ["Rose"], base: ["Ambre", "Ambroxan", "Encens", "Cuir", "Musc", "Myrrhe"] }, "extrait"),
  product("matiere-premiere", "Bois d'Ébène", "bois-debene", { top: ["Poivre", "Citron"], heart: ["Cèdre", "Iris"], base: ["Patchouli", "Vanille"] }, "extrait"),
  product("matiere-premiere", "Cologne Cédrat", "cologne-cedrat", { top: ["Baies roses", "Bergamote", "Cédrat", "Citron", "Maté", "Poivre noir"], heart: ["Fleur d'oranger"], base: ["Musc blanc", "Accord vanillé"] }, "extrait"),
  product("matiere-premiere", "Vanille Powder", "vanille-powder", { top: ["Vanille", "Poivre rose", "Notes poudrées", "Absolu de tonka"], heart: [], base: [] }, "extrait"),
  product("matiere-premiere", "Néroli Oranger", "neroli-oranger", { top: ["Néroli", "Orange amère"], heart: [], base: [] }, "extrait"),
  product("matiere-premiere", "Parisian Musk", "parisian-musk", { top: ["Figuier", "Feuille de violette"], heart: [], base: ["Ambre gris", "Ambrette", "Ambroxan", "Cèdre", "Musc blanc"] }, "extrait"),
  product("matiere-premiere", "French Flower", "french-flower", { top: ["Poire", "Gingembre"], heart: ["Tubéreuse", "Thé chinois", "Fleur d'oranger"], base: ["Ambroxan"] }, "extrait"),
  product("guerlain", "Cuir Béluga", "cuir-beluga", { top: ["Aldéhydes", "Mandarine"], heart: ["Patchouli", "Immortelle"], base: ["Vanille", "Héliotrope", "Daim", "Ambre"] }),
  product("guerlain", "Spiritueuse Double Vanille", "spiritueuse-double-vanille", { top: ["Encens", "Poivre rose", "Bergamote"], heart: ["Rose bulgare", "Jasmin", "Ylang-ylang", "Cèdre"], base: ["Vanille", "Benjoin"] }),
  product("dior", "Gris", "gris", { top: ["Bergamote"], heart: ["Rose", "Jasmin"], base: ["Patchouli", "Mousse de chêne", "Ambre", "Bois de santal", "Cèdre"] }),
  product("dior", "Bois d'Argent", "bois-dargent", { top: ["Bergamote", "Poivre rose"], heart: ["Iris", "Cèdre"], base: ["Musc", "Ambre gris"] }),
  product("dior", "Ambre Nuit", "ambre-nuit", { top: ["Bergamote", "Poivre noir"], heart: ["Rose"], base: ["Ambre", "Patchouli"] }),
  product("dior", "Rouge Trafalgar", "rouge-trafalgar", { top: ["Poivre rose", "Cerise"], heart: ["Rose turque", "Rose bulgare"], base: ["Fruits rouges"] }, "esprit", "out_of_stock"),
  product("tom-ford", "Vanille Fatale", "vanille-fatale", { top: ["Bergamote", "Poivre"], heart: ["Jasmin", "Cannelle"], base: ["Vanille", "Fève tonka"] }),
  product("tom-ford", "Bitter Peach", "bitter-peach", { top: ["Pêche", "Orange sanguine", "Cardamome", "Héliotrope"], heart: ["Rhum", "Cognac", "Davana", "Jasmin"], base: ["Vanille", "Patchouli", "Fève tonka", "Bois de santal", "Cashmeran", "Benjoin", "Styrax"] }),
  product("dolce-gabbana", "Velvet Zafferano", "velvet-zafferano", { top: ["Safran", "Bergamote"], heart: ["Jasmin", "Praline"], base: ["Vanille", "Bois de cèdre"] }),
  product("kilian", "Sacrée Wood", "sacree-wood", { top: ["Graines de carotte", "Ambrette"], heart: ["Bois de santal", "Amyris"], base: ["Lait", "Myrrhe", "Bois de cèdre"] }),
  product("kilian", "Angels' Share on the Rocks", "angels-share-on-the-rocks", { top: ["Cognac"], heart: ["Cannelle", "Chêne", "Fève tonka"], base: ["Praline", "Vanille", "Bois de santal"] }),
  product("crivelli", "Hibiscus Mahajád", "hibiscus-mahajad", { top: ["Menthe", "Cassis"], heart: ["Hibiscus", "Rose de Damas", "Cannelle"], base: ["Vanille", "Cuir", "Ambrette"] }),
  product("crivelli", "Oud Maracujá", "oud-maracuja", { top: ["Fruit de la passion", "Safran", "Rose de Turquie"], heart: ["Oud", "Patchouli", "Benjoin"], base: ["Cuir", "Vanille", "Ciste", "Akigalawood"] }),
  product("louis-vuitton", "L'Immensité", "limmensite", { top: ["Pamplemousse", "Gingembre", "Bergamote"], heart: ["Notes aquatiques", "Sauge", "Romarin", "Géranium"], base: ["Ambroxan", "Ambre", "Ciste labdanum"] }, "parfum", "out_of_stock"),
  product("louis-vuitton", "Au Hasard", "au-hasard", { top: ["Bergamote", "Citron"], heart: ["Cardamome", "Freesia", "Poire", "Néroli"], base: ["Bois de santal", "Ambrette", "Musc", "Cuir"] }),
  product("louis-vuitton", "Ombre Nomade", "ombre-nomade", { top: ["Framboise", "Géranium"], heart: ["Rose", "Safran", "Encens"], base: ["Oud", "Bouleau", "Benjoin"] }, "parfum", "out_of_stock"),
  product("louis-vuitton", "Myriade", "myriade", { top: ["Safran"], heart: ["Rose bulgare", "Rose centifolia"], base: ["Oud d'Assam", "Fèves de cacao", "Muscs blancs", "Ambrette"] }),
  product("liquides-imaginaires", "Blanche Bête", "blanche-bete", { top: ["Graines d'ambrette", "Accord lacté"], heart: ["Jasmin", "Tubéreuse", "Mahonial", "Encens"], base: ["Fève tonka", "Cacao", "Musc", "Vanille"] }),
  product("liquides-imaginaires", "Liquide", "liquide", { top: ["Poivre noir", "Cardamome", "Bergamote"], heart: ["Encens", "Notes métalliques", "Iris"], base: ["Musc", "Ambroxan", "Bois de santal", "Daim"] }),
  product("cartier", "Oud & Ambre", "oud-ambre", { top: ["Notes épicées"], heart: ["Oud"], base: ["Ambre"] }),
  product("cartier", "Oud & Santal", "oud-santal", { top: ["Sirop de prune"], heart: ["Oud"], base: ["Bois de santal"] }),
  product("creed", "Aventus", "aventus", { top: ["Ananas", "Bergamote", "Pomme", "Cassis"], heart: ["Bouleau", "Patchouli", "Jasmin", "Rose"], base: ["Musc", "Mousse de chêne", "Ambre gris", "Vanille"] }),
  product("creed", "Aventus Absolu", "aventus-absolu", { top: ["Pamplemousse", "Bergamote", "Cassis"], heart: ["Gingembre", "Cannelle", "Cardamome", "Cédrat"], base: ["Poivre rose", "Patchouli", "Vétiver"] }),
  product("creed", "Himalaya", "himalaya", { top: ["Pamplemousse", "Bergamote de Calabre", "Citron de Sicile"], heart: ["Bois de santal"], base: ["Musc", "Ambre gris", "Bois de cèdre"] }),
  product("creed", "Royal Oud", "royal-oud", { top: ["Poivre rose", "Citron vert", "Galbanum"], heart: ["Angélique", "Cèdre", "Cardamome"], base: ["Oud", "Bois de santal", "Musc"] }),
  product("creed", "Oud Zarian", "oud-zarian", { top: ["Encens", "Épices"], heart: ["Rose centifolia", "Patchouli", "Bois de santal", "Myrrhe"], base: ["Oud Choron"] }),
  product("creed", "Centaurus", "centaurus", { top: ["Cardamome", "Cannelle", "Tabac", "Poivre rose"], heart: ["Géranium", "Bois de santal", "Héliotrope", "Jasmin", "Patchouli"], base: ["Benjoin", "Baume Tolu", "Fève tonka", "Vanille bourbon"] }),
  product("creed", "Sublime Vanille", "sublime-vanille", { top: ["Vanille", "Fève tonka"], heart: ["Citron blanc", "Bergamote"], base: ["Musc", "Musc Tonkin"] }),
  product("creed", "Delphinus", "delphinus", { top: ["Poivre noir", "Encens", "Poivre rose", "Amande douce"], heart: ["Orchidée", "Héliotrope", "Racine d'iris"], base: ["Vanille bourbon", "Patchouli", "Fève tonka"] }),
  product("creed", "Aventus for Her", "aventus-for-her", { top: ["Pomme verte", "Bergamote", "Patchouli", "Citron", "Poivre rose", "Violette"], heart: ["Musc", "Rose", "Bois de santal", "Styrax"], base: ["Cassis", "Pêche", "Ambre", "Ylang-ylang"] }),
  product("creed", "Green Irish Tweed", "green-irish-tweed", { top: ["Citron", "Verveine", "Menthe poivrée"], heart: ["Feuilles de violette"], base: ["Iris", "Bois de santal", "Ambre gris"] }),
  product("creed", "Acqua Fiorentina", "acqua-fiorentina", { top: ["Pomme", "Prune"], heart: ["Bergamote", "Citron", "Rose", "Œillet"], base: ["Pamplemousse blanc", "Cèdre", "Bois de santal"] }),
  product("creed", "Tabarome", "tabarome", { top: ["Bergamote", "Mandarine"], heart: ["Gingembre"], base: ["Patchouli", "Ambre gris", "Bois de santal", "Tabac"] }),
  product("creed", "Spice and Wood", "spice-and-wood", { top: ["Pomme", "Bergamote", "Citron"], heart: ["Poivre", "Bouleau", "Clou de girofle", "Angélique", "Patchouli"], base: ["Cèdre", "Iris", "Mousse de chêne", "Musc"] }),
  product("creed", "Love in White", "love-in-white", { top: ["Zeste d'orange"], heart: ["Iris", "Narcisse", "Magnolia", "Riz", "Jasmin", "Rose"], base: ["Bois de santal", "Vanille", "Ambre gris"] }),
  product("creed", "Silver Mountain Water", "silver-mountain-water", { top: ["Bergamote", "Mandarine"], heart: ["Thé vert", "Cassis"], base: ["Galbanum", "Musc", "Bois de santal", "Petit-grain"] }),
];

const ROSE_VARIANTS = new Set(["rose-bulgare", "rose-de-damas", "rose-de-turquie", "rose-turque", "rose-centifolia", "rose-centifolia-de-grasse"]);
const FAMILY_TOKENS: Array<[NoteFamily, string[]]> = [
  ["agrume", ["bergamote", "citron", "orange", "cedrat", "pamplemousse", "mandarine", "neroli"]],
  ["floral", ["rose", "jasmin", "violette", "tubereuse", "iris", "ylang", "fleur", "orchidee", "hibiscus", "magnolia", "narcisse", "oeillet", "freesia"]],
  ["cuire", ["cuir", "daim"]],
  ["gourmand", ["vanille", "tonka", "cacao", "praline", "lait", "amande", "cognac", "rhum", "peche", "pomme", "fruits", "poire"]],
  ["aromatique", ["menthe", "sauge", "romarin", "verveine", "the", "mate", "coriandre", "camomille", "genievre"]],
  ["aquatique", ["aquatique"]],
  ["musc", ["musc", "ambrette"]],
  ["ambre", ["ambre", "benjoin", "ciste", "labdanum", "myrrhe", "encens", "baume"]],
  ["epice", ["safran", "poivre", "cardamome", "cannelle", "cumin", "gingembre", "epice", "clou", "piment"]],
];

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
}

export function inferNoteFamily(name: string): NoteFamily {
  const normalized = slugify(name);
  for (const [family, tokens] of FAMILY_TOKENS) {
    if (tokens.some((token) => normalized.includes(token))) return family;
  }
  return "boise";
}

export function buildStructuredNotes(catalog = MULTI_BRAND_CATALOG): StructuredNote[] {
  const records = new Map<string, StructuredNote>();
  records.set("rose", { name: "Rose", slug: "rose", family: "floral" });

  for (const product of catalog) {
    for (const layer of ["top", "heart", "base"] as const) {
      for (const name of product.notes[layer]) {
        const slug = slugify(name);
        records.set(slug, {
          name,
          slug,
          family: inferNoteFamily(name),
          ...(ROSE_VARIANTS.has(slug) ? { parentSlug: "rose" } : {}),
        });
      }
    }
  }

  return Array.from(records.values());
}

export function notesAsText(notes: string[]): string {
  return notes.join(", ");
}
