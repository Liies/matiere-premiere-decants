import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, cartItems, cartSyncReceipts, orders, orderItems, InsertOrder, InsertOrderItem } from "../drizzle/schema";
import { ENV } from './_core/env';
import { buildCartSyncPlan } from "@shared/cart-sync";

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

/**
 * Orders queries
 */
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(orders).values(order);
  return result;
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
