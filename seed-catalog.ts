import dotenv from "dotenv";
import mysql from "mysql2/promise";
import {
  BRANDS,
  buildStructuredNotes,
  LEGACY_CATALOG_PRICE_CENTS,
  MULTI_BRAND_CATALOG,
  notesAsText,
} from "./shared/catalog-data";

dotenv.config();

const LEGAL_NOTICE = "Produit reconditionné par nos soins. Les marques citées appartiennent à leurs titulaires respectifs ; ce produit n'est ni affilié à ni approuvé par la maison de parfum concernée.";

async function requireId(
  connection: mysql.Connection,
  table: "brands" | "notes" | "products",
  field: "slug" | "name",
  value: string,
): Promise<number> {
  const [rows] = await connection.execute<mysql.RowDataPacket[]>(`SELECT id FROM ${table} WHERE ${field} = ? LIMIT 1`, [value]);
  const id = rows[0]?.id as number | undefined;
  if (!id) throw new Error(`Identifiant introuvable dans ${table} pour ${field}=${value}`);
  return id;
}

async function seedCatalog() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL est requis pour lancer le seed catalogue.");
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    await connection.beginTransaction();

    for (const brand of BRANDS) {
      await connection.execute(
        `INSERT INTO brands (name, slug, tier, story, sortOrder, isActive)
         VALUES (?, ?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE name = VALUES(name), tier = VALUES(tier), story = VALUES(story), sortOrder = VALUES(sortOrder), isActive = true`,
        [brand.name, brand.slug, brand.tier, brand.story, brand.sortOrder],
      );
    }

    const notes = buildStructuredNotes();
    for (const note of notes) {
      await connection.execute(
        `INSERT INTO notes (name, slug, family)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), family = VALUES(family)`,
        [note.name, note.slug, note.family],
      );
    }
    for (const note of notes.filter((note) => note.parentSlug)) {
      const parentId = await requireId(connection, "notes", "slug", note.parentSlug!);
      await connection.execute("UPDATE notes SET parentId = ? WHERE slug = ?", [parentId, note.slug]);
    }

    for (const item of MULTI_BRAND_CATALOG) {
      const brandId = await requireId(connection, "brands", "slug", item.brandSlug);
      await connection.execute(
        `INSERT INTO products (
          brandId, name, slug, concentration, gender, status, legalNotice, description,
          topNotes, heartNotes, baseNotes, price, volumeMl, stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 50, 0)
        ON DUPLICATE KEY UPDATE
          brandId = VALUES(brandId), name = VALUES(name), concentration = VALUES(concentration),
          gender = VALUES(gender), status = VALUES(status), legalNotice = VALUES(legalNotice),
          description = VALUES(description), topNotes = VALUES(topNotes), heartNotes = VALUES(heartNotes),
          baseNotes = VALUES(baseNotes)`,
        [
          brandId,
          item.name,
          item.slug,
          item.concentration,
          item.gender,
          item.status,
          LEGAL_NOTICE,
          item.description,
          notesAsText(item.notes.top),
          notesAsText(item.notes.heart),
          notesAsText(item.notes.base),
          LEGACY_CATALOG_PRICE_CENTS,
        ],
      );

      const productId = await requireId(connection, "products", "slug", item.slug);
      for (const layer of ["top", "heart", "base"] as const) {
        for (const [position, name] of item.notes[layer].entries()) {
          const noteId = await requireId(connection, "notes", "slug", name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/œ/g, "oe").replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "").toLowerCase());
          await connection.execute(
            "INSERT IGNORE INTO productNotes (productId, noteId, layer, position) VALUES (?, ?, ?, ?)",
            [productId, noteId, layer, position],
          );
        }
      }
    }

    await connection.commit();
    console.log(`Catalogue importé : ${BRANDS.length} maisons, ${MULTI_BRAND_CATALOG.length} parfums et ${notes.length} notes.`);
    console.log("Aucun flacon source ni prix de variante n'a été créé : renseignez les volumes, coûts et prix réels via le back-office avant toute vente.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

seedCatalog().catch((error: unknown) => {
  console.error("Échec du seed catalogue :", error);
  process.exitCode = 1;
});
