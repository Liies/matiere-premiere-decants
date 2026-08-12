CREATE TABLE `cartSyncReceipts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`syncKey` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cartSyncReceipts_id` PRIMARY KEY(`id`),
	CONSTRAINT `cartSyncReceipts_syncKey_unique` UNIQUE(`syncKey`)
);
