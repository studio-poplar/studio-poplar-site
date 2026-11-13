CREATE TYPE "public"."template" AS ENUM('tool', 'material', 'failure', 'mentor', 'numbers', 'season');--> statement-breakpoint
CREATE TYPE "public"."trade" AS ENUM('daiku', 'sakan', 'kawara', 'tatami', 'tategu', 'other');--> statement-breakpoint
CREATE TYPE "public"."visit_status" AS ENUM('waiting_guardian', 'sent', 'accepted', 'declined', 'no_answer', 'done');--> statement-breakpoint
CREATE TYPE "public"."work_status" AS ENUM('received', 'drafting', 'editor_review', 'owner_review', 'published', 'returned', 'withdrawn');--> statement-breakpoint
CREATE TABLE "batch_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"work_ids" jsonb NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "craftspeople" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"line_user_id" text,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"shop_name" text,
	"trade" "trade" NOT NULL,
	"area" text NOT NULL,
	"intro" text,
	"card_info" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"visit_open" boolean DEFAULT true NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"founding_member" boolean DEFAULT false NOT NULL,
	"proxy_registrant" text,
	"consent_at" timestamp with time zone,
	"voice_notes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_template" "template",
	"featured" boolean DEFAULT false NOT NULL,
	"org_id" uuid,
	"region" text DEFAULT 'kanagawa' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "craftspeople_line_user_id_unique" UNIQUE("line_user_id"),
	CONSTRAINT "craftspeople_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"target_id" text,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invite_codes" (
	"code" text PRIMARY KEY NOT NULL,
	"craftsperson_id" uuid NOT NULL,
	"used_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "line_events" (
	"webhook_event_id" text PRIMARY KEY NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"to_line_user_id" text NOT NULL,
	"kind" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visit_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"craftsperson_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"under18" boolean DEFAULT false NOT NULL,
	"guardian_name" text,
	"guardian_email" text,
	"guardian_token" text,
	"guardian_consent_at" timestamp with time zone,
	"school_or_job" text,
	"wishes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"message" text,
	"status" "visit_status" NOT NULL,
	"notified_at" timestamp with time zone,
	"reminded_at" timestamp with time zone,
	"decided_at" timestamp with time zone,
	"visit_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "visit_requests_guardian_token_unique" UNIQUE("guardian_token")
);
--> statement-breakpoint
CREATE TABLE "work_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_id" uuid NOT NULL,
	"r2_key" text NOT NULL,
	"drive_file_id" text,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "work_photos_r2_key_unique" UNIQUE("r2_key")
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"craftsperson_id" uuid NOT NULL,
	"status" "work_status" DEFAULT 'received' NOT NULL,
	"owner_words" text DEFAULT '' NOT NULL,
	"draft" jsonb,
	"public_title" text,
	"public_body" text,
	"instagram_texts" jsonb,
	"editor_questions" text,
	"return_reason" text,
	"reviewer" text,
	"owner_ok_at" timestamp with time zone,
	"owner_review_sent_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"listed" boolean DEFAULT true NOT NULL,
	"template" "template",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invite_codes" ADD CONSTRAINT "invite_codes_craftsperson_id_craftspeople_id_fk" FOREIGN KEY ("craftsperson_id") REFERENCES "public"."craftspeople"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_requests" ADD CONSTRAINT "visit_requests_craftsperson_id_craftspeople_id_fk" FOREIGN KEY ("craftsperson_id") REFERENCES "public"."craftspeople"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_photos" ADD CONSTRAINT "work_photos_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_craftsperson_id_craftspeople_id_fk" FOREIGN KEY ("craftsperson_id") REFERENCES "public"."craftspeople"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "craftspeople_trade_idx" ON "craftspeople" USING btree ("trade");--> statement-breakpoint
CREATE INDEX "events_kind_at_idx" ON "events" USING btree ("kind","at");--> statement-breakpoint
CREATE INDEX "push_log_sent_idx" ON "push_log" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "visit_requests_status_idx" ON "visit_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "work_photos_work_idx" ON "work_photos" USING btree ("work_id","sort");--> statement-breakpoint
CREATE INDEX "works_status_idx" ON "works" USING btree ("status");--> statement-breakpoint
CREATE INDEX "works_craftsperson_idx" ON "works" USING btree ("craftsperson_id","published_at");