// Server-only pre-filter for free-text answers. Runs before the Claude call so
// unexpected input (personal data, noise, abuse, "I don't know") is handled with
// fixed replies. Kept out of hearing-chat.ts so the NG list never ships to the
// client bundle.

export type GuardResult = {
  reflection: string;
  needs_followup: boolean;
  followup_question: string;
};

const PII_REFLECTION = "教えてくださり、ありがとうございます。個人情報は伊藤との個別のやり取りで伺いますね。";
const SHORT_REFLECTION = "もう少し詳しく伺えると嬉しいです。";
const SHORT_FOLLOWUP = "思い浮かぶことを、ひと言だけでも教えてください。";
const NEUTRAL_REFLECTION = "教えてくださり、ありがとうございます。";
const UNSURE_REFLECTION = "なるほど、今はまだ明確でないんですね。教えてくださりありがとうございます。";

// Checked against the text with hyphens/spaces removed, so any grouping of a
// 10-11 digit number starting with 0 matches. The lookbehind keeps plain amounts
// like "1000000円" from being mistaken for a phone number.
const PHONE_PATTERN = /(?<!\d)0\d{9,10}(?!\d)/;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/;

const NG_WORDS = ["死ね", "しね", "殺す", "ころす", "くたばれ", "ふざけるな", "消えろ", "クソ野郎"];

// Matched only against short answers so a substantive reply that merely
// contains "わからない" still reaches the model.
const UNSURE_PATTERNS = [
  "わからない",
  "わかりません",
  "分からない",
  "分かりません",
  "特にない",
  "特にありません",
  "特になし",
  "未定",
  "まだ考えていない",
  "なんとも言えない",
];
// Too short to substring-match safely (e.g. "伝わらない" contains "ない").
const UNSURE_EXACT = ["なし", "ない", "無し"];
const UNSURE_MAX_LENGTH = 20;

function stripNoise(text: string): string {
  return text.replace(/[\p{P}\p{S}\s]/gu, "");
}

function containsPersonalInfo(normalized: string): boolean {
  return EMAIL_PATTERN.test(normalized) || PHONE_PATTERN.test(normalized.replace(/[-\s]/g, ""));
}

export function guardFreeText(userAnswer: string, alreadyFollowedUp: boolean): GuardResult | null {
  const normalized = userAnswer.normalize("NFKC").toLowerCase();
  const compact = stripNoise(normalized);

  if (containsPersonalInfo(normalized)) {
    return { reflection: PII_REFLECTION, needs_followup: false, followup_question: "" };
  }

  if (NG_WORDS.some((w) => compact.includes(w))) {
    return { reflection: NEUTRAL_REFLECTION, needs_followup: false, followup_question: "" };
  }

  const unsure =
    UNSURE_EXACT.includes(compact) || (compact.length <= UNSURE_MAX_LENGTH && UNSURE_PATTERNS.some((p) => compact.includes(p)));
  if (unsure) {
    return { reflection: UNSURE_REFLECTION, needs_followup: false, followup_question: "" };
  }

  if (compact.length <= 2) {
    if (alreadyFollowedUp) {
      return { reflection: NEUTRAL_REFLECTION, needs_followup: false, followup_question: "" };
    }
    return { reflection: SHORT_REFLECTION, needs_followup: true, followup_question: SHORT_FOLLOWUP };
  }

  return null;
}
