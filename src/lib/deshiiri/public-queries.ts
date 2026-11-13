import "server-only";
import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db, schema } from "@/lib/deshiiri/db";
import type { CardInfo } from "@/lib/deshiiri/db/schema";
import { TRADES, type Trade } from "@/lib/deshiiri/trades";

// 公開ページが読むのはここだけ（指示書 5章）。
// 読むのは「公開済みの仕事の一日」と「公開してよい職人の項目」だけ。LINE の ID・招待コード・話し方メモ・
// 下書き・確認事項・見学の申し込みはここから出さない。
// DB の結果はタグ付きでキャッシュし、公開・取り下げのときに作り直す（lib/deshiiri/publish.ts）。

export const PUBLIC_TAG = "deshiiri-public";
export const personTag = (slug: string) => `deshiiri-person-${slug}`;

/** 一覧から外すまでの日数（90日更新がない人は職種一覧に出さない）。 */
const ACTIVE_DAYS = 90;

export type PublicPhoto = { key: string; alt: string; width: number; height: number };
export type PublicWork = { id: string; title: string; body: string; publishedAt: string; photos: PublicPhoto[] };
export type PublicPerson = {
  slug: string;
  displayName: string;
  shopName: string | null;
  trade: Trade;
  area: string;
  intro: string | null;
  card: CardInfo;
  visitOpen: boolean;
  featured: boolean;
};
export type PublicListItem = PublicPerson & { latestWork: PublicWork | null; latestAt: string | null };

const hasDb = () => Boolean(process.env.DATABASE_URL);

/**
 * 表（または列）がまだない＝マイグレーションを当てる前。新しい環境の最初のビルドがここで落ちないよう、
 * そのときだけ「まだ誰もいない」として扱う。ほかの失敗はそのまま投げる。
 */
export function beforeMigration(e: unknown): boolean {
  for (let cur: unknown = e, i = 0; cur && i < 4; cur = (cur as { cause?: unknown }).cause, i++) {
    const code = (cur as { code?: unknown }).code;
    if (code === "42P01" || code === "42703") return true;
  }
  return false;
}

async function orEmpty<T>(empty: T, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (e) {
    if (beforeMigration(e)) return empty;
    throw e;
  }
}

// 読む列はここに書いたものだけ（LINE の ID などは DB からも取り出さない）。
// 列を足すマイグレーションが当たる前のビルドでも落ちないように、select() で全部の列を取らない。
const c = schema.craftspeople;
const personCols = {
  id: c.id,
  slug: c.slug,
  displayName: c.displayName,
  shopName: c.shopName,
  trade: c.trade,
  area: c.area,
  intro: c.intro,
  cardInfo: c.cardInfo,
  visitOpen: c.visitOpen,
  featured: c.featured,
};
const w = schema.works;
const workCols = {
  id: w.id,
  craftspersonId: w.craftspersonId,
  publicTitle: w.publicTitle,
  publicBody: w.publicBody,
  publishedAt: w.publishedAt,
  createdAt: w.createdAt,
};
const ph = schema.workPhotos;
const photoCols = { workId: ph.workId, r2Key: ph.r2Key, alt: ph.alt, width: ph.width, height: ph.height };

type PersonRow = { [K in keyof typeof personCols]: (typeof c.$inferSelect)[K] };

/** 90日の区切りを動かすため、一覧は公開・取り下げがなくても1日で作り直す。 */
const DAY = 24 * 60 * 60;

function toPublicPerson(p: PersonRow): PublicPerson {
  return {
    slug: p.slug,
    displayName: p.displayName,
    shopName: p.shopName,
    trade: p.trade,
    area: p.area,
    intro: p.intro,
    card: p.cardInfo,
    visitOpen: p.visitOpen,
    featured: p.featured,
  };
}

async function publishedWorks(craftspersonIds: string[], since?: Date) {
  if (!craftspersonIds.length) return [];
  const where = [
    inArray(schema.works.craftspersonId, craftspersonIds),
    eq(schema.works.status, "published"),
    eq(schema.works.listed, true),
  ];
  if (since) where.push(gte(schema.works.publishedAt, since));
  const works = await db()
    .select(workCols)
    .from(schema.works)
    .where(and(...where))
    .orderBy(desc(schema.works.publishedAt));
  const photos = works.length
    ? await db()
        .select(photoCols)
        .from(schema.workPhotos)
        .where(inArray(schema.workPhotos.workId, works.map((w) => w.id)))
        .orderBy(schema.workPhotos.sort)
    : [];
  return works.map((w) => ({
    craftspersonId: w.craftspersonId,
    work: {
      id: w.id,
      title: w.publicTitle ?? "",
      body: w.publicBody ?? "",
      publishedAt: (w.publishedAt ?? w.createdAt).toISOString(),
      photos: photos
        .filter((p) => p.workId === w.id)
        .map((p) => ({ key: p.r2Key, alt: p.alt, width: p.width, height: p.height })),
    } satisfies PublicWork,
  }));
}

/** 職人ページ（S-2）。公開済みの仕事の一日が1件もなければ null（ページを出さない）。 */
export function getPublicPerson(slug: string) {
  return unstable_cache(
    async (): Promise<{ person: PublicPerson; works: PublicWork[] } | null> => {
      if (!hasDb()) return null;
      return orEmpty(null, async () => {
        const [p] = await db().select(personCols).from(c).where(eq(c.slug, slug)).limit(1);
        if (!p) return null;
        const works = (await publishedWorks([p.id])).map((w) => w.work);
        if (!works.length) return null;
        return { person: toPublicPerson(p), works };
      });
    },
    ["deshiiri-person", slug],
    { tags: [PUBLIC_TAG, personTag(slug)] },
  )();
}

/** 職種一覧（S-1）。編集部が選んだ人 → 最近の仕事の一日がある順。90日更新がない人は外す。 */
export function listByTrade(trade: Trade) {
  return unstable_cache(
    async (): Promise<PublicListItem[]> => {
      if (!hasDb()) return [];
      const people = await orEmpty([], () => db().select(personCols).from(c).where(eq(c.trade, trade)));
      const since = new Date(Date.now() - ACTIVE_DAYS * 24 * 60 * 60 * 1000);
      const recent = await publishedWorks(people.map((p) => p.id), since);
      return people
        .map((p) => {
          const latest = recent.find((r) => r.craftspersonId === p.id)?.work ?? null;
          return { ...toPublicPerson(p), latestWork: latest, latestAt: latest?.publishedAt ?? null };
        })
        .filter((p) => p.latestWork)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.latestAt ?? "").localeCompare(a.latestAt ?? ""));
    },
    ["deshiiri-trade", trade],
    { tags: [PUBLIC_TAG], revalidate: DAY },
  )();
}

/** 職種ごとの人数（一覧の入口用）。 */
export function tradeCounts() {
  return unstable_cache(
    async (): Promise<Record<Trade, number>> => {
      const counts = Object.fromEntries(TRADES.map((t) => [t, 0])) as Record<Trade, number>;
      if (!hasDb()) return counts;
      for (const t of TRADES) counts[t] = (await listByTrade(t)).length;
      return counts;
    },
    ["deshiiri-trade-counts"],
    { tags: [PUBLIC_TAG], revalidate: DAY },
  )();
}
