ALTER TABLE `orderItems` ADD `sizeMl` int;--> statement-breakpoint
ALTER TABLE `variants` ADD `stock` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `variants` ADD `sortOrder` int DEFAULT 0 NOT NULL;