ALTER TABLE `products` ADD `archivedAt` timestamp;--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `archivedAt` timestamp NULL;
UPDATE `products` SET `archivedAt` = `updatedAt` WHERE `isArchived` = 1 AND `archivedAt` IS NULL;
CREATE INDEX `products_archived_at_idx` ON `products` (`archivedAt`);
