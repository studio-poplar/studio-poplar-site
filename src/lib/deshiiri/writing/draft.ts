import { z } from "zod";
import { TEMPLATES } from "@/lib/deshiiri/db/schema";
import { findBannedWords } from "./banned-words";

// 下書きの形（Claude の構造化出力で受け取る）と、出てきた下書きの検査（指示書 7章）。

export const DraftOutput = z.object({
  template: z.enum([...TEMPLATES, "none"]).describe("使った型。どれも合わなければ none"),
  title: z.string().describe("見出し。20字以内"),
  body: z.string().describe("本文。120〜250字。本人の一言を「」でそのまま冒頭近くに置く"),
  alts: z.array(z.string()).describe("写真ごとの代替テキスト。写真の順に、写っているものだけを短く"),
  editor_questions: z.array(z.string()).describe("編集部が本人に確認したいこと。なければ空"),
  instagram: z
    .array(
      z.object({
        kind: z.enum(["short", "normal", "question"]),
        text: z.string(),
      }),
    )
    .describe("Instagram 用文章。short・normal・question の2〜3案"),
});
export type DraftOutput = z.infer<typeof DraftOutput>;

export const TITLE_MAX = 20;
export const BODY_MIN = 120;
export const BODY_MAX = 250;

const chars = (s: string) => [...s.replace(/\s/g, "")].length;

export type DraftProblem = { level: "error" | "warn"; message: string };

/**
 * 下書きを確かめる。error は作り直しの対象（使わない言葉など）、warn は編集部に見せる注意。
 * ownerWords は本人の一言、photoCount は写真の枚数。
 */
export function checkDraft(draft: DraftOutput, ownerWords: string, photoCount: number): DraftProblem[] {
  const problems: DraftProblem[] = [];

  const texts = [draft.title, draft.body, ...draft.alts, ...draft.instagram.map((i) => i.text)];
  const banned = [...new Set(texts.flatMap(findBannedWords))];
  if (banned.length) problems.push({ level: "error", message: `使わない言葉が入っています：${banned.join("、")}` });

  const t = chars(draft.title);
  if (t === 0 || t > TITLE_MAX) problems.push({ level: "warn", message: `見出しが ${t} 字です（20字以内）` });
  const b = chars(draft.body);
  if (b < BODY_MIN || b > BODY_MAX) problems.push({ level: "warn", message: `本文が ${b} 字です（120〜250字）` });

  const firstWords = ownerWords
    .split(/\n|。/)
    .map((s) => s.trim())
    .find(Boolean);
  if (firstWords && !draft.body.normalize("NFKC").includes(firstWords.normalize("NFKC"))) {
    problems.push({ level: "warn", message: "本人の一言が本文にそのまま入っていません" });
  }

  if (photoCount > 0 && draft.alts.length !== photoCount) {
    problems.push({ level: "warn", message: `代替テキストが ${draft.alts.length} 件です（写真は ${photoCount} 枚）` });
  }

  if (draft.instagram.length < 2 || draft.instagram.length > 3) {
    problems.push({ level: "warn", message: `Instagram 用の案が ${draft.instagram.length} 件です（2〜3案）` });
  }
  for (const post of draft.instagram) {
    const tags: string[] = post.text.match(/#[^\s#]+/g) ?? [];
    if (!tags.includes("#デシイリ")) problems.push({ level: "warn", message: `Instagram（${post.kind}）に #デシイリ がありません` });
    if (tags.length < 3 || tags.length > 5) {
      problems.push({ level: "warn", message: `Instagram（${post.kind}）のハッシュタグが ${tags.length} 個です（3〜5個）` });
    }
  }
  return problems;
}

export const hasErrors = (problems: DraftProblem[]) => problems.some((p) => p.level === "error");
