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

const VARIANTS = [
  { sizeMl: 2, priceCents: 1_000 },
  { sizeMl: 50, priceCents: 12_000 },
];

const isApplyMode = process.argv.includes("--apply");
const placeholders = TARGET_PRODUCTS.map(() => "?").join(", ");
const productIds = TARGET_PRODUCTS.map(({ id }) => id);

function productSku(productId, sizeMl) {
  return `MP-${productId}-${sizeMl}ML`;
}

function assertMigrationPreconditions(products, sourceBottleCounts) {
  if (products.length !== TARGET_PRODUCTS.length) {
    throw new Error("La liste des parfums Matière Première ne correspond pas au périmètre attendu.");
  }

  for (const product of products) {
    const expected = TARGET_PRODUCTS.find(({ id }) => id === product.id);
    if (!expected || product.name !== expected.name) {
      throw new Error(`Le produit ${product.id} ne correspond pas au catalogue Matière Première attendu.`);
    }
    if (Number(product.price) !== 12_000 || Number(product.volumeMl) !== 50) {
      throw new Error(`${product.name} ne correspond pas au prix ou à la contenance historique attendus.`);
    }
    if (!Number.isInteger(Number(product.stock)) || Number(product.stock) < 0) {
      throw new Error(`${product.name} possède un stock historique invalide.`);
    }
    if ((sourceBottleCounts.get(product.id) ?? 0) > 0) {
      throw new Error(`${product.name} possède déjà des flacons source : migration interrompue pour éviter un doublon.`);
    }
  }
}

async function loadMigrationReport(connection) {
  const [products] = await connection.execute(
    `SELECT id, name, price, volumeMl, stock FROM products WHERE id IN (${placeholders}) ORDER BY id`,
    productIds,
  );
  const [sourceBottleRows] = await connection.execute(
    `SELECT productId, COUNT(*) AS count FROM sourceBottles WHERE productId IN (${placeholders}) GROUP BY productId`,
    productIds,
  );
  const sourceBottleCounts = new Map(sourceBottleRows.map((row) => [Number(row.productId), Number(row.count)]));
  assertMigrationPreconditions(products, sourceBottleCounts);

  const [variantRows] = await connection.execute(
    `SELECT productId, sizeMl, priceCents, sku FROM variants WHERE productId IN (${placeholders}) ORDER BY productId, sizeMl`,
    productIds,
  );
  const [legacyCartRows] = await connection.execute(
    `SELECT COUNT(*) AS count FROM cartItems WHERE productId IN (${placeholders}) AND variantId IS NULL`,
    productIds,
  );

  const totalBottles = products.reduce((sum, product) => sum + Number(product.stock), 0);
  const totalVolumeMl = totalBottles * 50;

  return {
    targetProducts: products.map((product) => ({
      id: Number(product.id),
      name: product.name,
      legacyBottleCount: Number(product.stock),
      sourceVolumeMl: Number(product.stock) * 50,
    })),
    targetVariantCount: TARGET_PRODUCTS.length * VARIANTS.length,
    existingVariantCount: variantRows.length,
    sourceBottlesToCreate: totalBottles,
    sourceVolumeMlToCreate: totalVolumeMl,
    legacyCartItemsToMigrate: Number(legacyCartRows[0].count),
    prices: VARIANTS.map(({ sizeMl, priceCents }) => ({ sizeMl, priceCents })),
  };
}

async function applyMigration(connection) {
  await connection.beginTransaction();
  try {
    const [lockedProducts] = await connection.execute(
      `SELECT id, name, price, volumeMl, stock FROM products WHERE id IN (${placeholders}) ORDER BY id FOR UPDATE`,
      productIds,
    );
    const [lockedBottleRows] = await connection.execute(
      `SELECT productId, COUNT(*) AS count FROM sourceBottles WHERE productId IN (${placeholders}) GROUP BY productId FOR UPDATE`,
      productIds,
    );
    const lockedBottleCounts = new Map(lockedBottleRows.map((row) => [Number(row.productId), Number(row.count)]));
    assertMigrationPreconditions(lockedProducts, lockedBottleCounts);

    for (const product of lockedProducts) {
      const [existingVariants] = await connection.execute(
        "SELECT id, sizeMl, priceCents, sku FROM variants WHERE productId = ? FOR UPDATE",
        [product.id],
      );
      const variantsBySize = new Map(existingVariants.map((variant) => [Number(variant.sizeMl), variant]));

      for (const definition of VARIANTS) {
        const existing = variantsBySize.get(definition.sizeMl);
        if (existing) {
          if (Number(existing.priceCents) !== definition.priceCents || existing.sku !== productSku(product.id, definition.sizeMl)) {
            throw new Error(`La variante ${definition.sizeMl} ml de ${product.name} existe déjà avec des données incompatibles.`);
          }
          continue;
        }
        await connection.execute(
          "INSERT INTO variants (productId, sizeMl, sku, priceCents, isActive) VALUES (?, ?, ?, ?, true)",
          [product.id, definition.sizeMl, productSku(product.id, definition.sizeMl), definition.priceCents],
        );
      }

      const bottleValues = Array.from({ length: Number(product.stock) }, (_, index) => [
        product.id,
        `LEGACY-P${product.id}-B${index + 1}`,
        50,
        "50.00",
        0,
      ]);
      if (bottleValues.length > 0) {
        const rowPlaceholders = bottleValues.map(() => "(?, ?, ?, ?, ?)").join(", ");
        await connection.execute(
          `INSERT INTO sourceBottles (productId, batchRef, capacityMl, remainingMl, purchasePriceCents) VALUES ${rowPlaceholders}`,
          bottleValues.flat(),
        );
      }

      const [freshVariants] = await connection.execute(
        "SELECT id FROM variants WHERE productId = ? AND sizeMl = 50 LIMIT 1",
        [product.id],
      );
      const fiftyMlVariant = freshVariants[0];
      if (!fiftyMlVariant) throw new Error(`La variante 50 ml de ${product.name} n’a pas pu être créée.`);
      await connection.execute(
        "UPDATE cartItems SET variantId = ? WHERE productId = ? AND variantId IS NULL",
        [fiftyMlVariant.id, product.id],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL est requis pour simuler ou appliquer cette migration.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const report = await loadMigrationReport(connection);
  console.log(JSON.stringify({ mode: isApplyMode ? "apply" : "dry-run", ...report }, null, 2));
  if (isApplyMode) {
    await applyMigration(connection);
    console.log("Migration appliquée avec succès.");
  }
} finally {
  connection.destroy();
}
