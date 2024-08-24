CREATE TABLE `email_verification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`user_id` text NOT NULL,
	`verification_type` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tenancy` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tenancy_plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tenancy_id` text NOT NULL,
	`is_free` integer,
	`starts_at` integer,
	`expires_at` integer,
	`stripe_subscription_id` text,
	`stripe_customer_id` text,
	`stripe_price_id` text,
	FOREIGN KEY (`tenancy_id`) REFERENCES `tenancy`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`tenancy_id` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`tenancy_id`) REFERENCES `tenancy`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`account_type` text NOT NULL,
	`password_hash` text,
	`salt` text,
	`google_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`user_id` text NOT NULL,
	`display_name` text,
	`first_name` text,
	`last_name` text,
	`date_of_birth` integer,
	`image` text,
	`bio` text DEFAULT '',
	`locale` text DEFAULT 'en' NOT NULL,
	`theme` text DEFAULT 'system' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_verification_user_id_unique` ON `email_verification` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenancy_plan_stripe_subscription_id_unique` ON `tenancy_plan` (`stripe_subscription_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenancy_plan_stripe_customer_id_unique` ON `tenancy_plan` (`stripe_customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenancy_plan_stripe_price_id_unique` ON `tenancy_plan` (`stripe_price_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_tenancy_id_unique` ON `user` (`tenancy_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_accounts_user_id_unique` ON `user_accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_accounts_google_id_unique` ON `user_accounts` (`google_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_profile_user_id_unique` ON `user_profile` (`user_id`);