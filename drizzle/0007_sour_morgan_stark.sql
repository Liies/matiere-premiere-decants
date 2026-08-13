CREATE TABLE `savedDeliveryAddresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`address` text NOT NULL,
	`city` varchar(255) NOT NULL,
	`postalCode` varchar(20) NOT NULL,
	`country` varchar(120) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `savedDeliveryAddresses_id` PRIMARY KEY(`id`),
	CONSTRAINT `saved_delivery_addresses_user_unique` UNIQUE(`userId`)
);
