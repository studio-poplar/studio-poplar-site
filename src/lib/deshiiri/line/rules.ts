// LINE 受付の決まりごと（DB を使わない部分）。テストしやすいよう分けておく。

/** 写真と一言を1件にまとめる時間（指示書 7章：10分以内）。 */
export const GROUP_WINDOW_MS = 10 * 60 * 1000;
/** 質問への答えを待つ時間（30分）。 */
export const QUESTION_WINDOW_MS = 30 * 60 * 1000;
/** 1件の投稿の写真の上限。 */
export const MAX_PHOTOS = 4;
/** これより短い一言には、質問を1つだけ返す。 */
export const SHORT_WORDS = 10;
/** 招待コードの有効期間（14日）。 */
export const INVITE_TTL_MS = 14 * 24 * 60 * 60 * 1000;
/** 招待コードを続けて間違えてよい回数（1時間あたり）。 */
export const INVITE_FAIL_LIMIT = 5;

/** 全角数字や空白を許して、6けたの数字なら返す。 */
export function parseInviteCode(input: string): string | null {
  const t = input.normalize("NFKC").replace(/[\s-]/g, "");
  return /^\d{6}$/.test(t) ? t : null;
}

/** 一言が短く、まだ質問していなければ質問する。文字数は見た目の文字で数える（絵文字も1字）。 */
export function needsQuestion(words: string, questionAskedAt: Date | null): boolean {
  if (questionAskedAt) return false;
  return [...words.trim()].length < SHORT_WORDS;
}

export function joinWords(current: string, added: string): string {
  const a = current.trim();
  const b = added.trim();
  if (!a) return b;
  if (!b) return a;
  return `${a}\n${b}`;
}

/** 質問を返したあと、まだ答えをもらっていないか（質問のあとに一言が足されていない、30分以内）。 */
export function awaitingAnswer(work: { ownerQuestionAt: Date | null; updatedAt: Date }, now: Date): boolean {
  if (!work.ownerQuestionAt) return false;
  if (now.getTime() - work.ownerQuestionAt.getTime() > QUESTION_WINDOW_MS) return false;
  return work.updatedAt.getTime() <= work.ownerQuestionAt.getTime();
}

/** 写真を足してよい「まとめ先」か。 */
export function canTakePhoto(
  work: { photoCount: number; lineImageSetId: string | null; updatedAt: Date },
  imageSetId: string | null,
  now: Date,
): boolean {
  if (work.photoCount >= MAX_PHOTOS) return false;
  if (now.getTime() - work.updatedAt.getTime() > GROUP_WINDOW_MS) return false;
  if (imageSetId && work.lineImageSetId && work.lineImageSetId !== imageSetId) return false;
  return true;
}
