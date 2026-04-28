CREATE TABLE `case_followups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`complaintId` int,
	`role` enum('user','assistant') NOT NULL,
	`content` longtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `case_followups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` longtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lawyerId` int,
	`name` varchar(255) NOT NULL,
	`date` timestamp NOT NULL,
	`location` varchar(255) NOT NULL,
	`details` longtext NOT NULL,
	`status` enum('draft','submitted','in-review','resolved') NOT NULL DEFAULT 'draft',
	`pdfUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `complaints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lawyers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`specialization` varchar(255) NOT NULL,
	`category` enum('family-law','criminal-law','civil-law','labor-law','property-law','women-rights','consumer-law','other') NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`experience` int,
	`bio` text,
	`rating` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lawyers_id` PRIMARY KEY(`id`)
);
