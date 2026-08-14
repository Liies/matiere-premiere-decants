import { boolean, decimal, index, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Maisons de parfum : une entité distincte pour un catalogue multi-marques. */
export const brands = mysqlTable("brands", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  country: varchar("country", { length: 2 }),
  tier: mysqlEnum("tier", ["niche", "designer", "exclusive"]).default("niche").notNull(),
  story: text("story"),
  logoUrl: varchar("logoUrl", { length: 512 }),
  heroUrl: varchar("heroUrl", { length: 512 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = typeof brands.$inferInsert;

/** Notes olfactives dédoublonnées et classées pour les filtres fiables. */
export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull(),
  family: mysqlEnum("family", ["boise", "floral", "epice", "gourmand", "cuire", "ambre", "agrume", "musc", "aromatique", "aquatique"]),
  parentId: int("parentId"),
}, (table) => [
  uniqueIndex("notes_name_unique").on(table.name),
  uniqueIndex("notes_slug_unique").on(table.slug),
  index("notes_parent_id_idx").on(table.parentId),
]);

export type Note = typeof notes.$inferSelect;

/** Produits. Les colonnes textuelles de notes sont conservées pour la transition de l’interface actuelle. */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  // Nullable pendant la reprise des produits historiques ; obligatoire pour tout nouveau produit.
  brandId: int("brandId").references(() => brands.id, { onDelete: "set null", onUpdate: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  concentration: mysqlEnum("concentration", ["edt", "edp", "extrait", "parfum", "esprit", "cologne"]).default("parfum").notNull(),
  gender: mysqlEnum("gender", ["homme", "femme", "mixte"]).default("mixte").notNull(),
  perfumer: varchar("perfumer", { length: 160 }),
  releaseYear: int("releaseYear"),
  status: mysqlEnum("status", ["available", "out_of_stock", "discontinued", "coming_soon"]).default("available").notNull(),
  isArchived: boolean("isArchived").default(false).notNull(),
  legalNotice: text("legalNotice"),
  heroScore: int("heroScore").default(0).notNull(),
  description: text("description"),
  topNotes: text("topNotes"),
  heartNotes: text("heartNotes"),
  baseNotes: text("baseNotes"),
  // Compatibilité temporaire avec le panier historique ; la vente utilise progressivement variants.priceCents.
  price: int("price").notNull(),
  volumeMl: int("volumeMl").notNull().default(50),
  stock: int("stock").notNull().default(0),
  imageUrl: varchar("imageUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("products_brand_id_idx").on(table.brandId),
  index("products_brand_slug_idx").on(table.brandId, table.slug),
  index("products_status_idx").on(table.status),
  index("products_is_archived_idx").on(table.isArchived),
]);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/** Pyramide olfactive structurée : une note peut apparaître à plusieurs niveaux. */
export const productNotes = mysqlTable("productNotes", {
  productId: int("productId").notNull().references(() => products.id, { onDelete: "cascade", onUpdate: "cascade" }),
  noteId: int("noteId").notNull().references(() => notes.id, { onDelete: "restrict", onUpdate: "cascade" }),
  layer: mysqlEnum("layer", ["top", "heart", "base"]).notNull(),
  position: int("position").default(0).notNull(),
}, (table) => [
  primaryKey({ columns: [table.productId, table.noteId, table.layer], name: "product_notes_pk" }),
  index("product_notes_note_id_idx").on(table.noteId),
]);

export type ProductNote = typeof productNotes.$inferSelect;

/** Flacons réellement détenus. Le stock fiable est exprimé en millilitres restants. */
export const sourceBottles = mysqlTable("sourceBottles", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().references(() => products.id, { onDelete: "restrict", onUpdate: "cascade" }),
  batchRef: varchar("batchRef", { length: 64 }),
  capacityMl: int("capacityMl").notNull(),
  remainingMl: decimal("remainingMl", { precision: 7, scale: 2 }).notNull(),
  purchasePriceCents: int("purchasePriceCents").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
}, (table) => [index("source_bottles_product_id_idx").on(table.productId)]);

export type SourceBottle = typeof sourceBottles.$inferSelect;

/** Formats vendus, avec un SKU et un prix indépendants du produit parent. */
export const variants = mysqlTable("variants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().references(() => products.id, { onDelete: "restrict", onUpdate: "cascade" }),
  sizeMl: int("sizeMl").notNull(),
  sku: varchar("sku", { length: 64 }).notNull(),
  priceCents: int("priceCents").notNull(),
  stock: int("stock").notNull().default(0),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("variants_sku_unique").on(table.sku),
  uniqueIndex("variants_product_size_unique").on(table.productId, table.sizeMl),
  index("variants_product_id_idx").on(table.productId),
]);

export type Variant = typeof variants.$inferSelect;

/** Articles dans le panier ; variantId est la référence métier des nouveaux articles. */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull().references(() => products.id, { onDelete: "restrict", onUpdate: "cascade" }),
  variantId: int("variantId").notNull().references(() => variants.id, { onDelete: "restrict", onUpdate: "cascade" }),
  quantity: int("quantity").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("cart_items_user_variant_unique").on(table.userId, table.variantId)]);

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/** Reçus de synchronisation de panier invité afin de garantir l’idempotence. */
export const cartSyncReceipts = mysqlTable("cartSyncReceipts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  syncKey: varchar("syncKey", { length: 128 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Une adresse de livraison par défaut par client, réutilisable au checkout. */
export const savedDeliveryAddresses = mysqlTable("savedDeliveryAddresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  postalCode: varchar("postalCode", { length: 20 }).notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("saved_delivery_addresses_user_unique").on(table.userId)]);

export type SavedDeliveryAddress = typeof savedDeliveryAddresses.$inferSelect;
export type InsertSavedDeliveryAddress = typeof savedDeliveryAddresses.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderNumber: varchar("orderNumber", { length: 64 }).notNull().unique(),
  status: mysqlEnum("status", ["awaiting_payment", "pending", "paid", "processing", "shipped", "delivered", "cancelled"]).default("awaiting_payment").notNull(),
  totalAmount: int("totalAmount").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: varchar("shippingCity", { length: 255 }).notNull(),
  shippingPostalCode: varchar("shippingPostalCode", { length: 20 }).notNull(),
  shippingCountry: varchar("shippingCountry", { length: 120 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull().references(() => products.id, { onDelete: "restrict", onUpdate: "cascade" }),
  variantId: int("variantId").references(() => variants.id, { onDelete: "set null", onUpdate: "cascade" }),
  productName: varchar("productName", { length: 255 }).notNull(),
  sizeMl: int("sizeMl"),
  quantity: int("quantity").notNull(),
  unitPrice: int("unitPrice").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/** Journal des mouvements de stock. */
export const stockMovements = mysqlTable("stockMovements", {
  id: int("id").autoincrement().primaryKey(),
  variantId: int("variantId").notNull().references(() => variants.id, { onDelete: "restrict", onUpdate: "cascade" }),
  delta: int("delta").notNull(),
  reason: mysqlEnum("reason", ["order", "restock", "adjustment", "loss", "return", "import"]).notNull(),
  orderId: int("orderId"),
  userId: int("userId"),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("stock_movements_variant_id_idx").on(table.variantId),
  index("stock_movements_created_at_idx").on(table.createdAt),
]);

export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = typeof stockMovements.$inferInsert;
