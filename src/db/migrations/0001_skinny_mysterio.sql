CREATE TABLE `connection_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text,
	`linkedin` text,
	`twitter` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer
);
