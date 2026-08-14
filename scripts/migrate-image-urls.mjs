import { getDb } from "../server/db";
import { products } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const mapping = {
  1: "/manus-storage/perfume-bottle-1_35573870.png",
  2: "/manus-storage/perfume-bottle-2_439724d1.png",
  3: "/manus-storage/perfume-bottle-3_1ae129bd.png",
  4: "/manus-storage/perfume-bottle-4_fcaada5e.png",
  5: "/manus-storage/perfume-bottle-5_678deeea.png",
  6: "/manus-storage/perfume-bottle-6_0534406a.png",
  7: "/manus-storage/perfume-bottle-7_0cca3472.png",
  8: "/manus-storage/perfume-bottle-8_c154a2b0.png",
  9: "/manus-storage/perfume-bottle-9_6d12d513.png",
  10: "/manus-storage/perfume-bottle-10_8dfc5687.png",
};

async function migrateImages() {
  const db = await getDb();
  if (!db) {
    console.error("Impossible de se connecter à la base de données.");
    process.exit(1);
  }
  console.log("Migration des URL d'images produits vers la base de données...");
  for (const [idStr, url] of Object.entries(mapping)) {
    const id = Number(idStr);
    await db.update(products).set({ imageUrl: url }).where(eq(products.id, id));
    console.log(`Produit #${id} mis à jour avec imageUrl: ${url}`);
  }
  console.log("Migration des images terminée avec succès.");
  process.exit(0);
}

migrateImages().catch((err) => {
  console.error("Erreur lors de la migration des images:", err);
  process.exit(1);
});
