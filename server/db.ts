import { and, asc, eq, gt, gte, inArray, sql, or, like, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, brands, products, cartItems, cartSyncReceipts, orders, orderItems, InsertOrder, InsertOrderItem, sourceBottles, variants, savedDeliveryAddresses, productReviews, stockMovements } from "../drizzle/schema";
import { ENV } from './_core/env';
import { buildCartSyncPlan } from "@shared/cart-sync";
import { consolidateOrderLines, type RequestedOrderLine } from "@shared/inventory";
import { REVIEW_ELIGIBLE_ORDER_STATUSES } from "@shared/reviews";
import { calculateShipping } from "@shared/shipping";

export const PUBLIC_BRAND_SLUG = "matiere-premiere";

let _db: ReturnType<typeof drizzle> | null = null;
type DatabaseClient = NonNullable<Awaited<ReturnType<typeof getDb>>>;
type DatabaseTransaction = Parameters<Parameters<DatabaseClient["transaction"]>[0]>[0];

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

export async function getCatalogProducts(brandSlug: string = PUBLIC_BRAND_SLUG, search?: string) {
  const db = await getDb();
  if (!db) return [];
  let query = db
    .select({ product: products, brand: brands })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .$dynamic();

  const conditions = [eq(products.isArchived, false)];
  if (brandSlug) {
    conditions.push(eq(brands.slug, brandSlug));
  }
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    conditions.push(or(like(products.name, term), like(products.description, term), like(brands.name, term))!);
  }

  return query.where(and(...conditions));
}

export async function getBrands() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(brands)
    .where(and(eq(brands.isActive, true), eq(brands.slug, PUBLIC_BRAND_SLUG)))
    .orderBy(asc(brands.sortOrder));
}

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];

  const productVariants = await db
    .select()
    .from(variants)
    .where(and(eq(variants.productId, productId), eq(variants.isActive, true)))
    .orderBy(asc(variants.sortOrder), asc(variants.sizeMl));
  return productVariants.map((variant) => ({ ...variant, availableQuantity: variant.stock }));
}

export async function getVariantsByProductIds(productIds: number[]) {
  const db = await getDb();
  if (!db || productIds.length === 0) return [];
  return db
    .select()
    .from(variants)
    .where(inArray(variants.productId, productIds))
    .orderBy(asc(variants.sortOrder), asc(variants.sizeMl));
}

export async function getVariantById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(variants).where(eq(variants.id, id)).limit(1);
  return rows[0];
}

export async function getVariantsByProductId(productId: number) {
  return getVariantsByProductIds([productId]);
}

/** Décrémente le stock si et seulement si toutes les unités demandées sont encore disponibles. */
export async function decrementVariantStock(tx: DatabaseTransaction, variantId: number, quantity: number) {
  const updateResult = await tx
    .update(variants)
    .set({ stock: sql`${variants.stock} - ${quantity}` })
    .where(and(eq(variants.id, variantId), gte(variants.stock, quantity)));
  return Number((updateResult as unknown as [{ affectedRows?: number }])[0]?.affectedRows ?? 0) === 1;
}

export async function getProductAvailableMl(productId: number) {
  const db = await getDb();
  if (!db) return 0;
  const bottles = await db
    .select({ remainingMl: sourceBottles.remainingMl })
    .from(sourceBottles)
    .where(and(eq(sourceBottles.productId, productId), gt(sourceBottles.remainingMl, "0")));
  return bottles.reduce((sum, bottle) => sum + Number(bottle.remainingMl), 0);
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
    .where(and(
      eq(brands.slug, brandSlug),
      eq(brands.isActive, true),
      eq(products.slug, productSlug),
      eq(products.isArchived, false),
    ))
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

/** Définit un stock administrativement et enregistre les écarts réels dans le journal des mouvements. */
export async function updateVariantStock(variantId: number, stock: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("La mise à jour de l’inventaire est indisponible");

  return db.transaction(async (tx) => {
    const rows = await tx.select().from(variants).where(eq(variants.id, variantId)).limit(1);
    const variant = rows[0];
    if (!variant) return undefined;

    const delta = stock - variant.stock;
    if (delta === 0) return { variant: { ...variant, stock }, delta };

    await tx.update(variants).set({ stock }).where(eq(variants.id, variantId));
    await tx.insert(stockMovements).values({
      variantId,
      delta,
      reason: "adjustment",
      userId,
      note: "Ajustement administratif du stock",
    });

    return { variant: { ...variant, stock }, delta };
  });
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

export async function getCartItemsWithDetails(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  if (items.length === 0) return [];

  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const variantIds = Array.from(new Set(items.map((item) => item.variantId)));
  const [productRows, variantRows] = await Promise.all([
    db.select().from(products).where(inArray(products.id, productIds)),
    db.select().from(variants).where(inArray(variants.id, variantIds)),
  ]);
  const productsById = new Map(productRows.map((product) => [product.id, product]));
  const variantsById = new Map(variantRows.map((variant) => [variant.id, { ...variant, availableQuantity: variant.stock }]));

  return items.map((item) => ({
    ...item,
    product: productsById.get(item.productId) ?? null,
    variant: variantsById.get(item.variantId) ?? null,
  }));
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
  guestItems: Array<{ productId: number; variantId: number; quantity: number }>,
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

      const activeVariants = await tx.select().from(variants).where(eq(variants.isActive, true));
      const plan = buildCartSyncPlan({
        accountItems: accountItems.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })),
        guestItems,
        variants: activeVariants,
      });
      const existingByVariant = new Map<number, typeof accountItems>();

      accountItems.forEach((item) => {
        const rows = existingByVariant.get(item.variantId) ?? [];
        rows.push(item);
        existingByVariant.set(item.variantId, rows);
      });

      for (const item of plan) {
        const rows = existingByVariant.get(item.variantId) ?? [];
        if (rows.length === 0) {
          await tx.insert(cartItems).values({ userId, productId: item.productId, variantId: item.variantId, quantity: item.quantity });
          continue;
        }

        await tx.update(cartItems).set({ productId: item.productId, variantId: item.variantId, quantity: item.quantity }).where(eq(cartItems.id, rows[0].id));
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
  if (!db) return null;
  const rows = await db.select().from(savedDeliveryAddresses).where(eq(savedDeliveryAddresses.userId, userId)).limit(1);
  return rows[0] ?? null;
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

export class OrderTotalMismatchError extends Error {
  constructor() {
    super("Le montant de la commande ne correspond plus aux prix en vigueur");
    this.name = "OrderTotalMismatchError";
  }
}

type CreateReservedOrderInput = Omit<InsertOrder, "status" | "totalAmount" | "shippingCost"> & {
  lines: RequestedOrderLine[];
  requestedTotalAmount?: number;
};

export type ReservedOrderResult = {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  shippingCost: number;
  items: Array<{ productName: string; quantity: number; unitPrice: number }>;
};

/**
 * La commande, ses lignes et la décrémentation du stock de variante sont réalisées dans
 * une seule transaction. Les variantes sont verrouillées avant contrôle afin qu’un seul
 * client puisse obtenir la dernière unité disponible.
 */
export async function createReservedOrder(input: CreateReservedOrderInput): Promise<ReservedOrderResult> {
  const db = await getDb();
  if (!db) throw new Error("La création de commande est temporairement indisponible");

  const { lines: rawLines, requestedTotalAmount, ...orderValues } = input;
  const lines = consolidateOrderLines(rawLines);
  if (lines.length === 0) throw new InventoryUnavailableError("Aucun article dans la commande");

  return db.transaction(async (tx) => {
    let subtotalAmount = 0;
    const variantIds = lines.map((line) => line.variantId);
    const lockedVariants = await tx
      .select()
      .from(variants)
      .where(inArray(variants.id, variantIds))
      .for("update");
    const variantsById = new Map(lockedVariants.map((variant) => [variant.id, variant]));
    const productIds = Array.from(new Set(lockedVariants.map((variant) => variant.productId)));
    const lockedProducts = productIds.length > 0
      ? await tx.select().from(products).where(inArray(products.id, productIds)).for("update")
      : [];
    const productsById = new Map(lockedProducts.map((product) => [product.id, product]));

    const orderItemsToInsert: Array<{
      productId: number;
      variantId: number;
      productName: string;
      sizeMl: number;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const line of lines) {
      const variant = variantsById.get(line.variantId);
      const product = variant ? productsById.get(variant.productId) : undefined;
      if (!variant || !variant.isActive) {
        throw new InventoryUnavailableError("Format de décant indisponible");
      }
      if (!product || product.status !== "available") {
        throw new InventoryUnavailableError("Parfum indisponible");
      }

      const decremented = await decrementVariantStock(tx, variant.id, line.quantity);
      if (!decremented) {
        throw new InventoryUnavailableError(`Stock insuffisant pour ${product.name} en ${variant.sizeMl} ml`);
      }

      subtotalAmount += variant.priceCents * line.quantity;
      orderItemsToInsert.push({ productId: product.id, variantId: variant.id, productName: product.name, sizeMl: variant.sizeMl, quantity: line.quantity, unitPrice: variant.priceCents });
    }

    const shipping = calculateShipping(orderValues.shippingCountry, subtotalAmount);
    const totalAmount = subtotalAmount + shipping.appliedCostCents;
    if (requestedTotalAmount !== undefined && requestedTotalAmount !== totalAmount) {
      throw new OrderTotalMismatchError();
    }

    const orderResult = await tx.insert(orders).values({
      ...orderValues,
      status: "awaiting_payment",
      totalAmount,
      shippingCost: shipping.appliedCostCents,
    });
    const orderId = Number((orderResult as unknown as [{ insertId?: number }])[0]?.insertId);
    if (!orderId) throw new Error("Impossible de créer la commande");

    await tx.insert(orderItems).values(orderItemsToInsert.map((item) => ({ orderId, ...item })));

    return {
      orderId,
      orderNumber: input.orderNumber,
      totalAmount,
      shippingCost: shipping.appliedCostCents,
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

export async function getOrderByStripeCheckoutSessionId(stripeCheckoutSessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.stripeCheckoutSessionId, stripeCheckoutSessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function setOrderStripeCheckoutSession(orderId: number, stripeCheckoutSessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("La préparation du paiement est temporairement indisponible");
  await db
    .update(orders)
    .set({ stripeCheckoutSessionId })
    .where(and(eq(orders.id, orderId), eq(orders.status, "awaiting_payment")));
}

export async function markStripeCheckoutOrderPaid(input: {
  orderId: number;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("La confirmation du paiement est temporairement indisponible");

  return db.transaction(async (tx) => {
    const rows = await tx.select().from(orders).where(eq(orders.id, input.orderId)).for("update");
    const order = rows[0];
    if (!order) throw new Error("Commande introuvable lors de la confirmation du paiement");
    if (order.stripeCheckoutSessionId !== input.stripeCheckoutSessionId) {
      throw new Error("La session de paiement ne correspond pas à la commande");
    }
    if (order.status !== "awaiting_payment") {
      return { changed: false as const, order, items: [] };
    }

    await tx
      .update(orders)
      .set({ status: "paid", stripePaymentIntentId: input.stripePaymentIntentId })
      .where(eq(orders.id, order.id));
    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    await tx.delete(cartItems).where(eq(cartItems.userId, order.userId));

    return {
      changed: true as const,
      order: { ...order, status: "paid" as const, stripePaymentIntentId: input.stripePaymentIntentId },
      items,
    };
  });
}

export async function releaseExpiredStripeCheckoutOrder(stripeCheckoutSessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("La libération de la réservation est temporairement indisponible");

  return db.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(orders)
      .where(eq(orders.stripeCheckoutSessionId, stripeCheckoutSessionId))
      .for("update");
    const order = rows[0];
    if (!order || order.status !== "awaiting_payment") return { released: false as const, order: order ?? null };

    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    for (const item of items) {
      if (item.variantId) {
        await tx
          .update(variants)
          .set({ stock: sql`${variants.stock} + ${item.quantity}` })
          .where(eq(variants.id, item.variantId));
      }
    }
    await tx.update(orders).set({ status: "cancelled" }).where(eq(orders.id, order.id));
    return { released: true as const, order: { ...order, status: "cancelled" as const } };
  });
}

export async function releaseReservedOrder(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("La libération de la réservation est temporairement indisponible");

  return db.transaction(async (tx) => {
    const rows = await tx.select().from(orders).where(eq(orders.id, orderId)).for("update");
    const order = rows[0];
    if (!order || order.status !== "awaiting_payment") return { released: false as const, order: order ?? null };

    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    for (const item of items) {
      if (item.variantId) {
        await tx
          .update(variants)
          .set({ stock: sql`${variants.stock} + ${item.quantity}` })
          .where(eq(variants.id, item.variantId));
      }
    }
    await tx.update(orders).set({ status: "cancelled" }).where(eq(orders.id, order.id));
    return { released: true as const, order: { ...order, status: "cancelled" as const } };
  });
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

export async function getOrderItemsByOrderIds(orderIds: number[]) {
  const db = await getDb();
  if (!db || orderIds.length === 0) return [];
  return db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));
}

export async function getPublishedProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: productReviews.id,
      rating: productReviews.rating,
      title: productReviews.title,
      body: productReviews.body,
      publishedAt: productReviews.publishedAt,
      createdAt: productReviews.createdAt,
      authorName: users.name,
    })
    .from(productReviews)
    .innerJoin(users, eq(productReviews.userId, users.id))
    .where(and(eq(productReviews.productId, productId), eq(productReviews.status, "published")))
    .orderBy(desc(productReviews.publishedAt), desc(productReviews.createdAt));

  return rows.map((review) => ({
    ...review,
    authorName: review.authorName?.trim().split(/\s+/)[0] || "Client vérifié",
  }));
}

export type ReviewEligibility = {
  eligibleOrderId: number | null;
  existingReview: { id: number; status: "pending" | "published" | "rejected" } | null;
};

export async function getReviewEligibility(userId: number, productId: number): Promise<ReviewEligibility> {
  const db = await getDb();
  if (!db) return { eligibleOrderId: null, existingReview: null };

  const [existingReview] = await db
    .select({ id: productReviews.id, status: productReviews.status })
    .from(productReviews)
    .where(and(eq(productReviews.userId, userId), eq(productReviews.productId, productId)))
    .limit(1);

  const [eligibleOrder] = await db
    .select({ id: orders.id })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(and(
      eq(orders.userId, userId),
      eq(orderItems.productId, productId),
      inArray(orders.status, REVIEW_ELIGIBLE_ORDER_STATUSES),
    ))
    .orderBy(desc(orders.createdAt))
    .limit(1);

  return {
    eligibleOrderId: eligibleOrder?.id ?? null,
    existingReview: existingReview
      ? { id: existingReview.id, status: existingReview.status }
      : null,
  };
}

export async function createVerifiedProductReview(input: {
  userId: number;
  productId: number;
  rating: number;
  title?: string;
  body: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Le dépôt d’avis est momentanément indisponible");

  const eligibility = await getReviewEligibility(input.userId, input.productId);
  if (eligibility.existingReview) throw new Error("Vous avez déjà déposé un avis pour ce parfum");
  const verifiedOrderId = eligibility.eligibleOrderId;
  if (!verifiedOrderId) throw new Error("Seuls les clients ayant acheté ce parfum peuvent déposer un avis");

  const result = await db.insert(productReviews).values({
    userId: input.userId,
    productId: input.productId,
    orderId: verifiedOrderId,
    rating: input.rating,
    title: input.title || null,
    body: input.body,
    status: "pending",
  });

  return Number((result as unknown as [{ insertId?: number }])[0]?.insertId);
}

export async function getPendingProductReviews() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ review: productReviews, productName: products.name, authorName: users.name })
    .from(productReviews)
    .innerJoin(products, eq(productReviews.productId, products.id))
    .innerJoin(users, eq(productReviews.userId, users.id))
    .where(eq(productReviews.status, "pending"))
    .orderBy(asc(productReviews.createdAt));
}

export async function moderateProductReview(id: number, status: "published" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("La modération des avis est momentanément indisponible");
  await db
    .update(productReviews)
    .set({ status, publishedAt: status === "published" ? new Date() : null })
    .where(eq(productReviews.id, id));
}
