CREATE TABLE `council_session` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `persona` (
	`id` integer PRIMARY KEY NOT NULL,
	`glyph` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`tag` text NOT NULL,
	`tag_bg` text NOT NULL,
	`tag_color` text NOT NULL,
	`spine` text NOT NULL,
	`quote` text NOT NULL,
	`conflicts` text DEFAULT '[]' NOT NULL,
	`prompt` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`priority` integer DEFAULT 1 NOT NULL
);
