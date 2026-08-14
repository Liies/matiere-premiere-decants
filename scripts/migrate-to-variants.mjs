import mysql from "mysql2/promise";

const TARGET_PRODUCTS = [
  { id: 1, name: "Vanilla Powder" },
  { id: 2, name: "Crystal Saffron" },
  { id: 3, name: "Radical Rose" },
  { id: 4, name: "Falcon Leather" },
  { id: 5, name: "Santal Austral" },
  { id: 6, name: "Encens Suave" },
  { id: 7, name: "Metal Lavender" },
  { id: 8, name: "Bois d'Ébène" },
  { id: 9, name: "Néroli Oranger" },
  { id: 10, name: "Cologne Cédrat" },
];

const VARIANT_DEFINITIONS = [
  { sizeMl: 2, priceCents: 1_000, stock: 10, sortOrder: 1 },
  { sizeMl: 50, priceCents: 12_000, stock: 10, sortOrder: 2 },
];

const isApplyMode = process.argv.includes("--apply");
const productIds = TARGET_PRODUCTS.map(({ id }) => id);
const placeholders = productIds.map(() => "?").join(", ");

function buildSku(slug, sizeMl) {
  return `MP-${slug.toUpperCase()}-${String(sizeMl).padStart(2, "0")}`;
}

function assertTargetProducts(products) {
  if (products.length !== TARGET_PRODUCTS.length) {
    throw new Error("Le catalogue Matière Première attendu est incomplet.");
  }

  for (const product of products) {
    const expected = TARGET_PRODUCTS.find(({ id }) => id === Number(product.id));
    if (!expected || expected.name !== product.name) {
      throw new Error(`Le produit ${product.id} ne correspond pas au périmètre Matière Première attendu.`);
    }
  }
}

async function loadState(connection, lockRows = false) {
  const lockingClause = lockRows ? " FOR UPDATE" : "";
  const [products] = await connection.execute(
    `SELECT id, name, slug FROM products WHERE id IN (${placeholders}) ORDER BY id${lockingClause}`,
    productIds,
  );
  assertTargetProducts(products);

  const [variantRows] = await connection.execute(
    `SELECT id, productId, sizeMl, sku, priceCents, stock, sortOrder
     FROM variants WHERE productId IN (${placeholders}) ORDER BY productId, sizeMl${lockingClause}`,
    productIds,
  );

  const [legacyCartRows] = await connection.execute(
    `SELECT COUNT(*) AS count FROM cartItems WHERE productId IN (${placeholders}) AND variantId IS NULL`,
    productIds,
  );
  const [legacyOrderRows] = await connection.execute(
    `SELECT COUNT(*) AS count FROM orderItems WHERE productId IN (${placeholders}) AND (variantId IS NULL OR sizeMl IS NULL)`,
    productIds,
  );

  return {
    products,
    variantsByProduct: new Map(productIds.map((id) => [id, variantRows.filter((variant) => Number(variant.productId) === id)])),
    legacyCartCount: Number(legacyCartRows[0]?.count ?? 0),
    legacyOrderCount: Number(legacyOrderRows[0]?.count ?? 0),
  };
}

function buildReport(state) {
  let variantsToCreate = 0;
  let variantsToInitialize = 0;

  for (const product of state.products) {
    const existingBySize = new Map(state.variantsByProduct.get(Number(product.id))?.map((variant) => [Number(variant.sizeMl), variant]));
    for (const definition of VARIANT_DEFINITIONS) {
      const existing = existingBySize.get(definition.sizeMl);
      if (!existing) {
        variantsToCreate += 1;
      } else if (Number(existing.stock) === 0 && Number(existing.sortOrder) === 0) {
        variantsToInitialize += 1;
      }
    }
  }

  return {
    mode: isApplyMode ? "apply" : "dry-run",
    products: state.products.length,
    variantsToCreate,
    variantsToInitialize,
    totalConfiguredStock: TARGET_PRODUCTS.length * VARIANT_DEFINITIONS.reduce((total, variant) => total + variant.stock, 0),
    legacyCartItemsToMigrate: state.legacyCartCount,
    legacyOrderItemsToComplete: state.legacyOrderCount,
    formats: VARIANT_DEFINITIONS.map(({ sizeMl, priceCents, stock }) => ({ sizeMl, priceCents, stock })),
  };
}

async function applyMigration(connection) {
  await connection.beginTransaction();
  try {
    const state = await loadState(connection, true);
    for (const product of state.products) {
      const existingBySize = new Map(state.variantsByProduct.get(Number(product.id))?.map((variant) => [Number(variant.sizeMl), variant]));
      const fiftyMlVariant = existingBySize.get(50);

      for (const definition of VARIANT_DEFINITIONS) {
        const existing = existingBySize.get(definition.sizeMl);
        const sku = buildSku(product.slug, definition.sizeMl);
        if (!existing) {
          await connection.execute(
            `INSERT INTO variants (productId, sizeMl, sku, priceCents, stock, isActive, sortOrder)
             VALUES (?, ?, ?, ?, ?, true, ?)`,
            [product.id, definition.sizeMl, sku, definition.priceCents, definition.stock, definition.sortOrder],
          );
          continue;
        }

        const initialStock = Number(existing.stock) === 0 && Number(existing.sortOrder) === 0 ? definition.stock : Number(existing.stock);
        await connection.execute(
          `UPDATE variants SET sku = ?, priceCents = ?, stock = ?, isActive = true, sortOrder = ? WHERE id = ?`,
          [sku, definition.priceCents, initialStock, definition.sortOrder, existing.id],
        );
      }

      const [variants] = await connection.execute(
        "SELECT id, sizeMl FROM variants WHERE productId = ? AND sizeMl IN (2, 50) FOR UPDATE",
        [product.id],
      );
      const migratedFiftyMlVariant = variants.find((variant) => Number(variant.sizeMl) === 50) ?? fiftyMlVariant;
      if (!migratedFiftyMlVariant) {
        throw new Error(`La variante 50 ml de ${product.name} est introuvable après migration.`);
      }

      await connection.execute(
        "UPDATE cartItems SET variantId = ? WHERE productId = ? AND variantId IS NULL",
        [migratedFiftyMlVariant.id, product.id],
      );
      await connection.execute(
        "UPDATE orderItems SET variantId = COALESCE(variantId, ?), sizeMl = COALESCE(sizeMl, 50) WHERE productId = ?",
        [migratedFiftyMlVariant.id, product.id],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL est requis pour exécuter cette migration.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const report = buildReport(await loadState(connection));
  console.log(JSON.stringify(report, null, 2));
  if (isApplyMode) {
    await applyMigration(connection);
    console.log("Migration corrective appliquée avec succès.");
  }
} finally {
  connection.destroy();
}
