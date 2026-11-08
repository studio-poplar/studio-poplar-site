// デシイリ SaaS（P1）のデータ設計。指示書 4章。
// テーブル名・列名は英語。org_id と region は P1 では使わないが、工務店・他地域を足すために最初から持つ。
// Supabase の RLS は使わないので、だれが読めるかはサーバー側のコードで決める（lib/deshiiri/admin-auth.ts と
// 公開ページ用の取得関数）。

import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const ts = (name: string) => timestamp(name, { withTimezone: true });

export const tradeEnum = pgEnum("trade", ["daiku", "sakan", "kawara", "tatami", "tategu", "other"]);

export const workStatusEnum = pgEnum("work_status", [
  "received",
  "drafting",
  "editor_review",
  "owner_review",
  "published",
  "returned",
  "withdrawn",
]);

export const visitStatusEnum = pgEnum("visit_status", [
  "waiting_guardian",
  "sent",
  "accepted",
  "declined",
  "no_answer",
  "done",
]);

/** 下書きの型（7章）。この順番で回す。 */
export const TEMPLATES = ["tool", "material", "failure", "mentor", "numbers", "season"] as const;
export const templateEnum = pgEnum("template", TEMPLATES);

/** 職人ページの「名刺」に出す項目。公開してよいものだけを入れる。 */
export type CardInfo = {
  phone?: string;
  hours?: string;
  website?: string;
  instagram?: string;
};

/** 話し方メモ。Instagram 用文章に反映する。 */
export type VoiceNotes = {
  firstPerson?: string;
  endings?: string;
  dialect?: string;
  habits?: string;
  emoji?: boolean;
  memo?: string;
};

export type Draft = {
  title: string;
  body: string;
  alts: string[];
};

export type InstagramText = { kind: "short" | "normal" | "question"; text: string };

export const craftspeople = pgTable(
  "craftspeople",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lineUserId: text("line_user_id").unique(),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    shopName: text("shop_name"),
    trade: tradeEnum("trade").notNull(),
    area: text("area").notNull(),
    intro: text("intro"),
    cardInfo: jsonb("card_info").$type<CardInfo>().notNull().default({}),
    visitOpen: boolean("visit_open").notNull().default(true),
    plan: text("plan").notNull().default("free"),
    foundingMember: boolean("founding_member").notNull().default(false),
    proxyRegistrant: text("proxy_registrant"),
    consentAt: ts("consent_at"),
    voiceNotes: jsonb("voice_notes").$type<VoiceNotes>().notNull().default({}),
    lastTemplate: templateEnum("last_template"),
    featured: boolean("featured").notNull().default(false),
    orgId: uuid("org_id"),
    region: text("region").notNull().default("kanagawa"),
    createdAt: createdAt(),
  },
  (t) => [index("craftspeople_trade_idx").on(t.trade)],
);

export const inviteCodes = pgTable("invite_codes", {
  code: text("code").primaryKey(),
  craftspersonId: uuid("craftsperson_id")
    .notNull()
    .references(() => craftspeople.id, { onDelete: "cascade" }),
  usedAt: ts("used_at"),
  expiresAt: ts("expires_at").notNull(),
  createdAt: createdAt(),
});

export const works = pgTable(
  "works",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    craftspersonId: uuid("craftsperson_id")
      .notNull()
      .references(() => craftspeople.id, { onDelete: "cascade" }),
    status: workStatusEnum("status").notNull().default("received"),
    ownerWords: text("owner_words").notNull().default(""),
    draft: jsonb("draft").$type<Draft>(),
    publicTitle: text("public_title"),
    publicBody: text("public_body"),
    instagramTexts: jsonb("instagram_texts").$type<InstagramText[]>(),
    editorQuestions: text("editor_questions"),
    returnReason: text("return_reason"),
    reviewer: text("reviewer"),
    ownerOkAt: ts("owner_ok_at"),
    ownerReviewSentAt: ts("owner_review_sent_at"),
    publishedAt: ts("published_at"),
    listed: boolean("listed").notNull().default(true),
    template: templateEnum("template"),
    createdAt: createdAt(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("works_status_idx").on(t.status),
    index("works_craftsperson_idx").on(t.craftspersonId, t.publishedAt),
  ],
);

export const workPhotos = pgTable(
  "work_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workId: uuid("work_id")
      .notNull()
      .references(() => works.id, { onDelete: "cascade" }),
    r2Key: text("r2_key").notNull().unique(),
    driveFileId: text("drive_file_id"),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    alt: text("alt").notNull().default(""),
    sort: integer("sort").notNull().default(0),
  },
  (t) => [index("work_photos_work_idx").on(t.workId, t.sort)],
);

export const visitRequests = pgTable(
  "visit_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    craftspersonId: uuid("craftsperson_id")
      .notNull()
      .references(() => craftspeople.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    under18: boolean("under18").notNull().default(false),
    guardianName: text("guardian_name"),
    guardianEmail: text("guardian_email"),
    guardianToken: text("guardian_token").unique(),
    guardianConsentAt: ts("guardian_consent_at"),
    schoolOrJob: text("school_or_job"),
    wishes: jsonb("wishes").$type<string[]>().notNull().default([]),
    message: text("message"),
    status: visitStatusEnum("status").notNull(),
    notifiedAt: ts("notified_at"),
    remindedAt: ts("reminded_at"),
    decidedAt: ts("decided_at"),
    visitDate: ts("visit_date"),
    createdAt: createdAt(),
  },
  (t) => [index("visit_requests_status_idx").on(t.status)],
);

/** LINE の webhookEventId。同じイベントを2回処理しないために使う。 */
export const lineEvents = pgTable("line_events", {
  webhookEventId: text("webhook_event_id").primaryKey(),
  receivedAt: ts("received_at").notNull().defaultNow(),
});

/** こちらから送ったプッシュ。月200通の無料枠を数える。 */
export const pushLog = pgTable(
  "push_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    toLineUserId: text("to_line_user_id").notNull(),
    kind: text("kind").notNull(),
    sentAt: ts("sent_at").notNull().defaultNow(),
  },
  (t) => [index("push_log_sent_idx").on(t.sentAt)],
);

export const batchJobs = pgTable("batch_jobs", {
  id: text("id").primaryKey(),
  workIds: jsonb("work_ids").$type<string[]>().notNull(),
  status: text("status").notNull(),
  createdAt: createdAt(),
  endedAt: ts("ended_at"),
});

/** 閲覧・クリックの記録。個人情報は入れない。 */
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind").notNull(),
    targetId: text("target_id"),
    at: ts("at").notNull().defaultNow(),
  },
  (t) => [index("events_kind_at_idx").on(t.kind, t.at)],
);

// Auth.js の Google ログインは JWT セッションで使うので、アカウント用のテーブルは持たない。
