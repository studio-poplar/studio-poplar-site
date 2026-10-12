import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";
import { CITIES, JOBS, cityLabel, jobLabel, type ContactPurpose } from "./codes";
import { readingMinutes } from "./format";
// 使わない言葉（指示書 1章）。記事・職人ファイルは読み込み時にここで、表示される全ページはビルド後に
// scripts/check-deshiiri-words.mjs が検査する。
import bannedWords from "../../../content/deshiiri/banned-words.json";

const BANNED_WORDS: string[] = bannedWords.words;

const ROOT = path.join(process.cwd(), "content/deshiiri");
const ARTICLE_DIR = path.join(ROOT, "articles");
const SHOKUNIN_DIR = path.join(ROOT, "shokunin");
const BANZUKE_FILE = path.join(ROOT, "banzuke.json");

// Drafts (draft: true) show in local dev and Vercel preview deployments, never in production.
const SHOW_DRAFTS = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";

// Files are read once per build. In dev they are re-read on every request so new or edited
// articles show up without restarting the server.
const CACHE = process.env.NODE_ENV === "production";

// ---------- types ----------

export type Shokunin = {
  id: string;
  yago: string;
  person: string | null;
  job: string;
  city: string;
  area: string;
  since: string | null;
  intro: string;
  photo: string | null;
  contact: Record<ContactPurpose, boolean>;
  links: { site: string | null; instagram: string | null };
  draft: boolean;
  // イメージ案: a made-up example. Shown with a notice, no contact form, kept out of search.
  sample: boolean;
};

export type ArticleMeta = {
  slug: string;
  no: number;
  title: string;
  shokunin: string;
  lead: string;
  midokoro: string[];
  hero: string | null;
  heroAlt: string;
  heroCaption: string | null;
  publishedAt: string;
  interviewedAt: string | null;
  featured: boolean;
  series: string | null;
  related: string[];
  sponsor: string | null;
  draft: boolean;
  // イメージ案: a made-up example. Shown with a notice, no contact form, kept out of search.
  sample: boolean;
  readingMinutes: number;
  // Copied from the craftsperson so lists and filters don't need a second lookup.
  job: string;
  city: string;
  area: string;
  yago: string;
};

export type Article = ArticleMeta & { body: string };

export type Banzuke = { month: string; items: { slug: string; views: number }[] };

// ---------- helpers ----------

function listFiles(dir: string, ext: RegExp) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => ext.test(f));
}

function required<T>(value: T | undefined | null, field: string, file: string): T {
  if (value === undefined || value === null || value === "") {
    throw new Error(`[deshiiri] ${file}: "${field}" がありません`);
  }
  return value;
}

const warned = new Set<string>();
function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`⚠ [deshiiri] ${message}`);
}

function checkBannedWords(text: string, file: string) {
  for (const word of BANNED_WORDS) {
    if (text.includes(word)) warnOnce(`${file}: 使わない言葉「${word}」が入っています`);
  }
}

// ---------- 職人 ----------

let shokuninCache: Shokunin[] | null = null;

function loadAllShokunin(): Shokunin[] {
  if (CACHE && shokuninCache) return shokuninCache;
  shokuninCache = listFiles(SHOKUNIN_DIR, /\.ya?ml$/).map((file) => {
    const raw = fs.readFileSync(path.join(SHOKUNIN_DIR, file), "utf8");
    checkBannedWords(raw, `shokunin/${file}`);
    const d = parseYaml(raw) ?? {};
    const contact = d.contact ?? {};
    return {
      id: required(d.id, "id", file),
      yago: required(d.yago, "yago", file),
      person: d.person ?? null,
      job: required(d.job, "job", file),
      city: required(d.city, "city", file),
      area: required(d.area, "area", file),
      since: d.since ?? null,
      intro: required(d.intro, "intro", file),
      photo: d.photo ?? null,
      // Every purpose is accepted unless the file explicitly says false.
      contact: {
        hanashi: contact.hanashi !== false,
        irai: contact.irai !== false,
        kengaku: contact.kengaku !== false,
        deshiiri: contact.deshiiri !== false,
      },
      links: { site: d.links?.site ?? null, instagram: d.links?.instagram ?? null },
      draft: d.draft === true,
      sample: d.sample === true,
    };
  });
  return shokuninCache;
}

export function getAllShokunin(): Shokunin[] {
  return loadAllShokunin().filter((s) => SHOW_DRAFTS || !s.draft);
}

export function getShokunin(id: string): Shokunin | undefined {
  return getAllShokunin().find((s) => s.id === id);
}

// ---------- 記事（帖） ----------

let articleCache: Article[] | null = null;

function loadAllArticles(): Article[] {
  if (CACHE && articleCache) return articleCache;
  const shokunin = loadAllShokunin();
  articleCache = listFiles(ARTICLE_DIR, /\.mdx$/)
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLE_DIR, file), "utf8");
      const { data: d, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      const person = shokunin.find((s) => s.id === d.shokunin);
      if (!person) throw new Error(`[deshiiri] articles/${file}: 職人 "${d.shokunin}" の YAML が見つかりません`);

      checkBannedWords(raw, `articles/${file}`);
      if (!/<Honest[\s>]/.test(content)) warnOnce(`articles/${file}: 「正直に、きついこと」（<Honest>）がありません`);

      const midokoro: string[] = Array.isArray(d.midokoro) ? d.midokoro : [];
      if (midokoro.length < 2) warnOnce(`articles/${file}: 見どころ（midokoro）は2〜3個入れてください`);

      return {
        slug,
        no: Number(required(d.no, "no", file)),
        title: required(d.title, "title", file),
        shokunin: person.id,
        lead: required(d.lead, "lead", file),
        midokoro,
        hero: d.hero ?? null,
        heroAlt: d.heroAlt ?? "",
        heroCaption: d.heroCaption ?? null,
        publishedAt: String(required(d.publishedAt, "publishedAt", file)),
        interviewedAt: d.interviewedAt ? String(d.interviewedAt) : null,
        featured: d.featured === true,
        series: d.series ?? null,
        related: Array.isArray(d.related) ? d.related : [],
        sponsor: d.sponsor ?? null,
        draft: d.draft === true,
        sample: d.sample === true,
        readingMinutes: readingMinutes(content),
        job: person.job,
        city: person.city,
        area: person.area,
        yago: person.yago,
        body: content,
      };
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : b.no - a.no));
  return articleCache;
}

function stripBody({ body: _body, ...meta }: Article): ArticleMeta {
  void _body;
  return meta;
}

// デシイリ goes public (search engines, the main site's footer link, the sitemap) once at least one
// article is published (draft: false). Until then the pages exist but stay out of sight.
export function isDeshiiriLive() {
  return loadAllArticles().some((a) => !a.draft);
}

// Newest first.
export function getAllArticles(): ArticleMeta[] {
  return loadAllArticles()
    .filter((a) => SHOW_DRAFTS || !a.draft)
    .map(stripBody);
}

export function getArticle(slug: string): Article | undefined {
  return loadAllArticles().find((a) => a.slug === slug && (SHOW_DRAFTS || !a.draft));
}

export function getArticlesByShokunin(id: string) {
  return getAllArticles().filter((a) => a.shokunin === id);
}

// 連載 (dougu / shigotogi / hirumeshi), newest first.
export function getSeriesArticles(series: string) {
  return getAllArticles().filter((a) => a.series === series);
}

// 今月の特集: the newest article marked featured, otherwise the newest article.
export function getFeaturedArticle() {
  const all = getAllArticles();
  return all.find((a) => a.featured) ?? all[0];
}

// 次に読む: `related` first, then the same job, then the same town, then the newest.
export function getNextArticles(article: ArticleMeta, count = 3): ArticleMeta[] {
  const others = getAllArticles().filter((a) => a.slug !== article.slug);
  const picked: ArticleMeta[] = [];
  const add = (a: ArticleMeta | undefined) => {
    if (a && !picked.includes(a) && picked.length < count) picked.push(a);
  };
  article.related.forEach((slug) => add(others.find((a) => a.slug === slug)));
  others.filter((a) => a.job === article.job).forEach(add);
  others.filter((a) => a.city === article.city).forEach(add);
  others.forEach(add);
  if (picked.length < 2) warnOnce(`articles/${article.slug}.mdx: 「次に読む」が${picked.length}本しかありません（公開中の記事が足りません）`);
  return picked;
}

// ---------- 番付 ----------

export function getBanzuke(): { month: string | null; items: (ArticleMeta & { views: number | null })[]; isRanking: boolean } {
  const articles = getAllArticles();
  // Fewer than six stories: no ranking yet, show the editors' picks (newest six) instead.
  if (articles.length < 6 || !fs.existsSync(BANZUKE_FILE)) {
    return { month: null, items: articles.slice(0, 6).map((a) => ({ ...a, views: null })), isRanking: false };
  }
  const data = JSON.parse(fs.readFileSync(BANZUKE_FILE, "utf8")) as Banzuke;
  const items = data.items
    .map((item) => {
      const a = articles.find((x) => x.slug === item.slug);
      return a ? { ...a, views: item.views } : null;
    })
    .filter((x): x is ArticleMeta & { views: number } => x !== null)
    .slice(0, 6);
  if (items.length < 6) {
    return { month: null, items: articles.slice(0, 6).map((a) => ({ ...a, views: null })), isRanking: false };
  }
  return { month: data.month, items, isRanking: true };
}

// ---------- 数（ヒーローの掲載数・索引のピル） ----------

export function getCounts() {
  const articles = getAllArticles();
  const people = getAllShokunin();
  const jobs = new Set(people.map((p) => p.job));
  return { articles: articles.length, shokunin: people.length, jobs: jobs.size };
}

// [{ code, label, articles, shokunin }] for every job / city that has at least one craftsperson.
export function getIndex(kind: "job" | "city") {
  const articles = getAllArticles();
  const people = getAllShokunin();
  const order = Object.keys(kind === "job" ? JOBS : CITIES);
  const rank = (code: string) => (order.includes(code) ? order.indexOf(code) : order.length);
  const codes = [...new Set(people.map((p) => p[kind]))].sort((a, b) => rank(a) - rank(b));
  const label = kind === "job" ? jobLabel : cityLabel;
  return codes.map((code) => ({
    code,
    label: label(code),
    articles: articles.filter((a) => a[kind] === code).length,
    shokunin: people.filter((p) => p[kind] === code).length,
  }));
}

// ---------- 連絡フォーム用 ----------

// The minimum the contact form needs about each craftsperson (passed to a client component).
export function getContactPeople() {
  // イメージ案の職人には連絡できない
  return getAllShokunin().filter((p) => !p.sample).map((p) => ({
    id: p.id,
    yago: p.yago,
    label: `${jobLabel(p.job)}／${p.area}`,
    contact: p.contact,
  }));
}
