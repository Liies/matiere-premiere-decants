import { and, asc, eq, gt, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, brands, products, cartItems, cartSyncReceipts, orders, orderItems, InsertOrder, InsertOrderItem, sourceBottles, variants, savedDeliveryAddresses } from "../drizzle/schema";
import { ENV } from './_core/env';
import { buildCartSyncPlan } from "@shared/cart-sync";
import { consolidateOrderLines, requiredMilliliters, type RequestedOrderLine } from "@shared/inventory";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Products queries
 */
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products);
}

export async function getCatalogProducts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ product: products, brand: brands })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id));
}

export async function getBrands() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(brands).where(eq(brands.isActive, true)).orderBy(asc(brands.sortOrder));
}

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];

  const [productVariants, bottles] = await Promise.all([
    db.select().from(variants).where(and(eq(variants.productId, productId), eq(variants.isActive, true))).orderBy(asc(variants.sizeMl)),
    db.select({ remainingMl: sourceBottles.remainingMl }).from(sourceBottles).where(and(eq(sourceBottles.productId, productId), gt(sourceBottles.remainingMl, "0"))),
  ]);
  const availableMl = bottles.reduce((sum, bottle) => sum + Number(bottle.remainingMl), 0);
  return productVariants.map((variant) => ({ ...variant, availableQuantity: Math.floor(availableMl / variant.sizeMl) }));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductByBrandSlug(brandSlug: string, productSlug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const rows = await db
    .select({ product: products, brand: brands })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(brands.slug, brandSlug), eq(products.slug, productSlug)))
    .limit(1);
  const row = rows[0];
  if (!row) return undefined;
  return { ...row.product, brand: row.brand, variants: await getProductVariants(row.product.id) };
}

export type ProductCatalogUpdate = {
  name: string;
  description: string;
  price: number;
  volumeMl: number;
};

export async function updateProductCatalog(id: number, values: ProductCatalogUpdate) {
  const db = await getDb();
  if (!db) return;
  await db.update(products).set(values).where(eq(products.id, id));
}

export async function createCatalogVariant(values: {
  productId: number;
  sizeMl: number;
  sku: string;
  priceCents: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("La mise à jour de l’inventaire est indisponible");
  await db.insert(variants).values(values);
}

export async function recordSourceBottle(values: {
  productId: number;
  batchRef?: string;
  capacityMl: number;
  remainingMl: string;
  purchasePriceCents: number;
  purchasedAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("La mise à jour de l’inventaire est indisponible");
  await db.insert(sourceBottles).values(values);
}

/**
 * Cart queries
 */
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addCartItem(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) return;

  const existingItems = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));

  if (existingItems.length > 0) {
    const mergedQuantity = existingItems.reduce((total, item) => total + item.quantity, quantity);
    await db.update(cartItems).set({ quantity: mergedQuantity }).where(eq(cartItems.id, existingItems[0].id));
    for (const duplicate of existingItems.slice(1)) {
      await db.delete(cartItems).where(eq(cartItems.id, duplicate.id));
    }
    return;
  }

  await db.insert(cartItems).values({ userId, productId, quantity });
}

export async function addCartVariant(userId: number, productId: number, variantId: number, quantity: number) {
  const db = await getDb();
  if (!db) return;

  const existingItems = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.variantId, variantId)));

  if (existingItems.length > 0) {
    const mergedQuantity = existingItems.reduce((total, item) => total + item.quantity, quantity);
    await db.update(cartItems).set({ quantity: mergedQuantity }).where(eq(cartItems.id, existingItems[0].id));
    for (const duplicate of existingItems.slice(1)) {
      await db.delete(cartItems).where(eq(cartItems.id, duplicate.id));
    }
    return;
  }

  await db.insert(cartItems).values({ userId, productId, variantId, quantity });
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
}

export async function removeCartItem(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearUserCart(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

export async function syncGuestCartToUserCart(
  userId: number,
  syncKey: string,
  guestItems: Array<{ productId: number; quantity: number }>,
) {
  const db = await getDb();
  if (!db) {
    throw new Error("La synchronisation du panier est temporairement indisponible");
  }

  const existingReceipt = await db
    .select()
    .from(cartSyncReceipts)
    .where(eq(cartSyncReceipts.syncKey, syncKey))
    .limit(1);

  if (existingReceipt.length > 0) {
    if (existingReceipt[0].userId !== userId) {
      throw new Error("Clé de synchronisation invalide");
    }
    return { alreadySynced: true } as const;
  }

  try {
    await db.transaction(async (tx) => {
      const accountItems = await tx.select().from(cartItems).where(eq(cartItems.userId, userId));
      const catalog = await tx.select({ id: products.id, stock: products.stock }).from(products);
      const plan = buildCartSyncPlan({
        accountItems: accountItems.map(({ productId, quantity }) => ({ productId, quantity })),
        guestItems,
        products: catalog,
      });
      const existingByProduct = new Map<number, typeof accountItems>();

      accountItems.forEach((item) => {
        const rows = existingByProduct.get(item.productId) ?? [];
        rows.push(item);
        existingByProduct.set(item.productId, rows);
      });

      for (const item of plan) {
        const rows = existingByProduct.get(item.productId) ?? [];
        if (rows.length === 0) {
          await tx.insert(cartItems).values({ userId, productId: item.productId, quantity: item.quantity });
          continue;
        }

        await tx.update(cartItems).set({ quantity: item.quantity }).where(eq(cartItems.id, rows[0].id));
        for (const duplicateRow of rows.slice(1)) {
          await tx.delete(cartItems).where(eq(cartItems.id, duplicateRow.id));
        }
      }

      await tx.insert(cartSyncReceipts).values({ userId, syncKey });
    });
  } catch (error) {
    const receiptAfterRetry = await db
      .select()
      .from(cartSyncReceipts)
      .where(and(eq(cartSyncReceipts.syncKey, syncKey), eq(cartSyncReceipts.userId, userId)))
      .limit(1);

    if (receiptAfterRetry.length > 0) {
      return { alreadySynced: true } as const;
    }
    throw error;
  }

  return { alreadySynced: false } as const;
}

/** Adresse de livraison par défaut du profil client. */
export async function getSavedDeliveryAddress(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(savedDeliveryAddresses).where(eq(savedDeliveryAddresses.userId, userId)).limit(1);
  return rows[0];
}

export async function saveDeliveryAddress(userId: number, address: {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("La sauvegarde de l’adresse est temporairement indisponible");
  await db.insert(savedDeliveryAddresses).values({ userId, ...address }).onDuplicateKeyUpdate({
    set: { ...address },
  });
}

/**
 * Orders queries
 */
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(orders).values(order);
  return result;
}

export class InventoryUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryUnavailableError";
  }
}

type CreateReservedOrderInput = Omit<InsertOrder, "status" | "totalAmount"> & {
  lines: RequestedOrderLine[];
};

export type ReservedOrderResult = {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  items: Array<{ productName: string; quantity: number; unitPrice: number }>;
};

/**
 * La commande, ses lignes et la décrémentation du stock sont réalisées dans une seule
 * transaction. Un format de décant consomme des millilitres de flacons source ; la voie
 * produit est conservée le temps de migrer les paniers historiques.
 */
export async function createReservedOrder(input: CreateReservedOrderInput): Promise<ReservedOrderResult> {
  const db = await getDb();
  if (!db) throw new Error("La création de commande est temporairement indisponible");

  const { lines: rawLines, ...orderValues } = input;
  const lines = consolidateOrderLines(rawLines);
  if (lines.length === 0) throw new InventoryUnavailableError("Aucun article dans la commande");

  return db.transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsToInsert: Array<{
      productId: number;
      variantId?: number;
      productName: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const line of lines) {
      if (line.variantId) {
        const variantRows = await tx.select().from(variants).where(eq(variants.id, line.variantId)).limit(1);
        const variant = variantRows[0];
        if (!variant || !variant.isActive || variant.productId !== line.productId) {
          throw new InventoryUnavailableError("Format de décant indisponible");
        }

        const productRows = await tx.select().from(products).where(eq(products.id, variant.productId)).limit(1);
        const product = productRows[0];
        if (!product || product.status !== "available") {
          throw new InventoryUnavailableError("Parfum indisponible");
        }

        let remainingToReserve = requiredMilliliters(variant.sizeMl, line.quantity);
        const bottles = await tx
          .select()
          .from(sourceBottles)
          .where(and(eq(sourceBottles.productId, product.id), gt(sourceBottles.remainingMl, "0")))
          .orderBy(asc(sourceBottles.purchasedAt));
        const totalAvailableMl = bottles.reduce((sum, bottle) => sum + Number(bottle.remainingMl), 0);
        if (totalAvailableMl < remainingToReserve) {
          throw new InventoryUnavailableError(`Stock insuffisant pour ${product.name}`);
        }

        for (const bottle of bottles) {
          if (remainingToReserve <= 0) break;
          const volumeToReserve = Math.min(Number(bottle.remainingMl), remainingToReserve);
          const updateResult = await tx
            .update(sourceBottles)
            .set({ remainingMl: sql`${sourceBottles.remainingMl} - ${volumeToReserve}` })
            .where(and(eq(sourceBottles.id, bottle.id), gte(sourceBottles.remainingMl, String(volumeToReserve))));
          const affectedRows = Number((updateResult as unknown as [{ affectedRows?: number }])[0]?.affectedRows ?? 0);
          if (affectedRows !== 1) {
            throw new InventoryUnavailableError(`Stock insuffisant pour ${product.name}`);
          }
          remainingToReserve -= volumeToReserve;
        }

        totalAmount += variant.priceCents * line.quantity;
        orderItemsToInsert.push({ productId: product.id, variantId: variant.id, productName: product.name, quantity: line.quantity, unitPrice: variant.priceCents });
        continue;
      }

      const productRows = await tx.select().from(products).where(eq(products.id, line.productId)).limit(1);
      const product = productRows[0];
      if (!product || product.status !== "available") {
        throw new InventoryUnavailableError("Parfum indisponible");
      }

      const updateResult = await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${line.quantity}` })
        .where(and(eq(products.id, product.id), gte(products.stock, line.quantity)));
      const affectedRows = Number((updateResult as unknown as [{ affectedRows?: number }])[0]?.affectedRows ?? 0);
      if (affectedRows !== 1) {
        throw new InventoryUnavailableError(`Stock insuffisant pour ${product.name}`);
      }

      totalAmount += product.price * line.quantity;
      orderItemsToInsert.push({ productId: product.id, productName: product.name, quantity: line.quantity, unitPrice: product.price });
    }

    const orderResult = await tx.insert(orders).values({ ...orderValues, status: "awaiting_payment", totalAmount });
    const orderId = Number((orderResult as unknown as [{ insertId?: number }])[0]?.insertId);
    if (!orderId) throw new Error("Impossible de créer la commande");

    await tx.insert(orderItems).values(orderItemsToInsert.map((item) => ({ orderId, ...item })));
    await tx.delete(cartItems).where(eq(cartItems.userId, input.userId));

    return {
      orderId,
      orderNumber: input.orderNumber,
      totalAmount,
      items: orderItemsToInsert.map(({ productName, quantity, unitPrice }) => ({ productName, quantity, unitPrice })),
    };
  });
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders);
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
}

/**
 * Order items queries
 */
export async function createOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) return;
  await db.insert(orderItems).values(item);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}
