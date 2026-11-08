ALTER TABLE "craftspeople" ADD COLUMN "drive_folder_id" text;--> statement-breakpoint
ALTER TABLE "works" ADD COLUMN "photo_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "works" ADD COLUMN "line_image_set_id" text;--> statement-breakpoint
ALTER TABLE "works" ADD COLUMN "owner_question_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_line_image_set_id_unique" UNIQUE("line_image_set_id");