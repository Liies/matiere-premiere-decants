ALTER TABLE `cartItems` DROP FOREIGN KEY `cartItems_variantId_variants_id_fk`;
--> statement-breakpoint
ALTER TABLE `cartItems` MODIFY COLUMN `variantId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `cartItems` ADD CONSTRAINT `cart_items_user_variant_unique` UNIQUE(`userId`,`variantId`);--> statement-breakpoint
ALTER TABLE `cartItems` ADD CONSTRAINT `cartItems_variantId_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `variants`(`id`) ON DELETE restrict ON UPDATE cascade;