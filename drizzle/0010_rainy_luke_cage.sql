CREATE TABLE `stockMovements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variantId` int NOT NULL,
	`delta` int NOT NULL,
	`reason` enum('order','restock','adjustment','loss','return','import') NOT NULL,
	`orderId` int,
	`userId` int,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stockMovements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `isArchived` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `stockMovements` ADD CONSTRAINT `stockMovements_variantId_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `variants`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `stock_movements_variant_id_idx` ON `stockMovements` (`variantId`);--> statement-breakpoint
CREATE INDEX `stock_movements_created_at_idx` ON `stockMovements` (`createdAt`);--> statement-breakpoint
CREATE INDEX `products_is_archived_idx` ON `products` (`isArchived`);