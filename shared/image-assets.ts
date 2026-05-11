/**
 * Image assets URLs for Matière Première e-commerce site
 * These URLs are tied to the webdev project lifecycle and will persist
 */

export const imageAssets = {
  // Master noses / Perfumers
  noses: {
    nose1: {
      original: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/master-perfumer-1-3cNkMXpa4BXpmkkqg6L48p.png",
      compressed: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/master-perfumer-1-DyHG5tY2bGnUxJzwm8fetf.webp",
    },
    nose2: {
      original: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/master-perfumer-2-c2m8ts5Ayzs2rL44959btg.png",
      compressed: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/master-perfumer-2-GwBHKZTdcVqPQ2X4nzYnKS.webp",
    },
  },
  // Hero background
  heroBackground: {
    original: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/hero-background-KCepfVwVdQ7xS3BFJzZun6.png",
    compressed: "https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/hero-background-PCDVJYemm2nGWjBWLNJARj.webp",
  },

  // Perfume bottles - all 10 products
  perfumes: {
    vanillaPowder: {
      original: "/manus-storage/perfume-bottle-1_35573870.png",
      compressed: "/manus-storage/perfume-bottle-1_35573870.png",
    },
    crystalSaffron: {
      original: "/manus-storage/perfume-bottle-2_439724d1.png",
      compressed: "/manus-storage/perfume-bottle-2_439724d1.png",
    },
    radicalRose: {
      original: "/manus-storage/perfume-bottle-3_1ae129bd.png",
      compressed: "/manus-storage/perfume-bottle-3_1ae129bd.png",
    },
    falconLeather: {
      original: "/manus-storage/perfume-bottle-4_fcaada5e.png",
      compressed: "/manus-storage/perfume-bottle-4_fcaada5e.png",
    },
    santalAustral: {
      original: "/manus-storage/perfume-bottle-5_678deeea.png",
      compressed: "/manus-storage/perfume-bottle-5_678deeea.png",
    },
    encensSuave: {
      original: "/manus-storage/perfume-bottle-6_0534406a.png",
      compressed: "/manus-storage/perfume-bottle-6_0534406a.png",
    },
    metalLavender: {
      original: "/manus-storage/perfume-bottle-7_0cca3472.png",
      compressed: "/manus-storage/perfume-bottle-7_0cca3472.png",
    },
    boisDebene: {
      original: "/manus-storage/perfume-bottle-8_c154a2b0.png",
      compressed: "/manus-storage/perfume-bottle-8_c154a2b0.png",
    },
    ambroxan: {
      original: "/manus-storage/perfume-bottle-9_6d12d513.png",
      compressed: "/manus-storage/perfume-bottle-9_6d12d513.png",
    },
    vetiverExtraordinaire: {
      original: "/manus-storage/perfume-bottle-10_8dfc5687.png",
      compressed: "/manus-storage/perfume-bottle-10_8dfc5687.png",
    },
  },
};

// Get nose image by ID
export const getNoseImage = (noseId: number) => {
  const imageMap: Record<number, keyof typeof imageAssets.noses> = {
    1: "nose1",
    2: "nose2",
  };
  const key = imageMap[noseId];
  return key ? imageAssets.noses[key] : null;
};

// Mapping product IDs to image assets
export const getProductImage = (productId: number) => {
  const imageMap: Record<number, keyof typeof imageAssets.perfumes> = {
    1: "vanillaPowder",
    2: "crystalSaffron",
    3: "radicalRose",
    4: "falconLeather",
    5: "santalAustral",
    6: "encensSuave",
    7: "metalLavender",
    8: "boisDebene",
    9: "ambroxan",
    10: "vetiverExtraordinaire",
  };

  const key = imageMap[productId];
  return key ? imageAssets.perfumes[key] : null;
};
