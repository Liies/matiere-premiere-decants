CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`country` varchar(2),
	`tier` enum('niche','designer','exclusive') NOT NULL DEFAULT 'niche',
	`story` text,
	`logoUrl` varchar(512),
	`heroUrl` varchar(512),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `brands_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`family` enum('boise','floral','epice','gourmand','cuire','ambre','agrume','musc','aromatique','aquatique'),
	`parentId` int,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`),
	CONSTRAINT `notes_name_unique` UNIQUE(`name`),
	CONSTRAINT `notes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `productNotes` (
	`productId` int NOT NULL,
	`noteId` int NOT NULL,
	`layer` enum('top','heart','base') NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `product_notes_pk` PRIMARY KEY(`productId`,`noteId`,`layer`)
);
--> statement-breakpoint
CREATE TABLE `sourceBottles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`batchRef` varchar(64),
	`capacityMl` int NOT NULL,
	`remainingMl` decimal(7,2) NOT NULL,
	`purchasePriceCents` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sourceBottles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`sizeMl` int NOT NULL,
	`sku` varchar(64) NOT NULL,
	`priceCents` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `variants_id` PRIMARY KEY(`id`),
	CONSTRAINT `variants_sku_unique` UNIQUE(`sku`),
	CONSTRAINT `variants_product_size_unique` UNIQUE(`productId`,`sizeMl`)
);
--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `status` enum('awaiting_payment','pending','paid','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'awaiting_payment';--> statement-breakpoint
ALTER TABLE `cartItems` ADD `variantId` int;--> statement-breakpoint
ALTER TABLE `orderItems` ADD `variantId` int;--> statement-breakpoint
ALTER TABLE `products` ADD `brandId` int;--> statement-breakpoint
ALTER TABLE `products` ADD `concentration` enum('edt','edp','extrait','parfum','esprit','cologne') DEFAULT 'parfum' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `gender` enum('homme','femme','mixte') DEFAULT 'mixte' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `perfumer` varchar(160);--> statement-breakpoint
ALTER TABLE `products` ADD `releaseYear` int;--> statement-breakpoint
ALTER TABLE `products` ADD `status` enum('available','out_of_stock','discontinued','coming_soon') DEFAULT 'available' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `legalNotice` text;--> statement-breakpoint
ALTER TABLE `products` ADD `heroScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `notes_parent_id_idx` ON `notes` (`parentId`);--> statement-breakpoint
CREATE INDEX `product_notes_note_id_idx` ON `productNotes` (`noteId`);--> statement-breakpoint
CREATE INDEX `source_bottles_product_id_idx` ON `sourceBottles` (`productId`);--> statement-breakpoint
CREATE INDEX `variants_product_id_idx` ON `variants` (`productId`);--> statement-breakpoint
CREATE INDEX `products_brand_id_idx` ON `products` (`brandId`);--> statement-breakpoint
CREATE INDEX `products_brand_slug_idx` ON `products` (`brandId`,`slug`);--> statement-breakpoint
CREATE INDEX `products_status_idx` ON `products` (`status`);