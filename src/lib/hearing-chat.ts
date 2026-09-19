// Shared conversation-flow definitions for the AI hearing chat (hybrid v3).
//
// Step 1 asks for the business stage (existing vs. starting); the wording of
// steps 2-6 is then picked per stage. The question skeleton — count, order and
// choice structure — is fixed by spec and must never be reordered or skipped.
// Chip answers are resolved entirely client-side against a hand-matched
// acknowledgment (no API call, no interpretation, cannot go "off-topic").
// Free text ("その他" or direct typing) is the only path that calls the API
// (except step 1, which is routing only), and only that single question's text
// + answer is sent — not the full conversation history — to keep each call
// small and cheap.

export type Category = "WEB" | "APP" | "PHOTO_VIDEO" | "UNDECIDED";

export type BusinessStage = "existing" | "starting";

export type Choice = {
  label: string;
  ack: string;
  category?: Category;
  stage?: BusinessStage;
};

export type Question = {
  label: string;
  text: string;
  choices: readonly Choice[];
  multiSelect?: boolean;
};

export const EXPECTATION_NOTICE = "所要時間の目安は約2〜3分です。途中でやめても大丈夫なので、気軽にお話しください。";

export const INTRO_MESSAGE = `はじめまして。ここでは肩の力を抜いて、思っていることをそのまま話してください。うまく整理できていなくても大丈夫です。${EXPECTATION_NOTICE}`;

// Step 1 — routing question; its answer selects the wording of steps 2-6.
export const STAGE_QUESTION: Question = {
  label: "事業ステージ",
  text: "今の事業の状況を教えてください",
  choices: [
    { label: "すでに事業をしている", ack: "なるほど、すでに動かれているんですね。", stage: "existing" },
    { label: "これから始める・準備中", ack: "これから始めるところなんですね、いいタイミングですね。", stage: "starting" },
  ],
};

const STARTING_HINT = /これから|準備|構想|検討|始めたい|始める|始めよう|開業(予定|前|したい)|未開業|創業(予定|前)|起業(予定|前|したい)/;

// Free text at step 1 can't be sent to the model (it only routes), so the
// stage is inferred from a few obvious phrases and defaults to "existing".
export function classifyStage(text: string): BusinessStage {
  return STARTING_HINT.test(text.normalize("NFKC")) ? "starting" : "existing";
}

type StagedQuestion = { existing: Question; starting: Question };

const STAGED_QUESTIONS: readonly StagedQuestion[] = [
  {
    // Q1: 課題の入口
    existing: {
      label: "課題の入口",
      text: "今、事業を進める中で一番ネックになっていることは何ですか?",
      choices: [
        { label: "新規のお客様が増えない", ack: "集客の壁、多くの方が直面するところですよね。" },
        { label: "価格や見積もりの説明で苦労する", ack: "価格の伝え方、悩ましいポイントですよね。" },
        { label: "サイトや資料が今の事業に合っていない", ack: "事業の成長にサイトが追いついていないこと、よくありますよね。" },
        { label: "何から手をつければいいか分からない", ack: "優先順位が見えにくい状態、整理していきましょう。" },
      ],
    },
    starting: {
      label: "課題の入口",
      text: "これから事業を始めるにあたって、一番ネックになっていることは何ですか?",
      choices: [
        { label: "何から準備すればいいか分からない", ack: "最初の一歩、悩む方は多いですよ。" },
        { label: "お客様にどう見せればいいか分からない", ack: "見せ方のイメージ、これから固めていきましょう。" },
        { label: "まだ何も用意できていない(サイト・資料等)", ack: "ゼロからのスタート、一緒に整理していきましょう。" },
        { label: "誰に相談すればいいか分からなかった", ack: "相談先が見えないと、動きづらいですよね。" },
      ],
    },
  },
  {
    // Q2: 具体化
    existing: {
      label: "具体化",
      text: "その課題は、具体的にどんな場面で表れますか?",
      choices: [
        { label: "問い合わせ・成約につながらない", ack: "反応はあっても成約に至らないの、もったいないですよね。" },
        { label: "価格交渉で安く見られてしまう", ack: "価値に見合った評価をされていないの、悔しいですよね。" },
        { label: "他社と比較されて選ばれない", ack: "比較の土俵に乗った時点で不利になっている感じ、ありますよね。" },
        { label: "そもそも認知されていない", ack: "知られていないことには始まらないですよね。" },
      ],
    },
    starting: {
      label: "具体化",
      text: "具体的に、どんな場面でその難しさを感じますか?",
      choices: [
        { label: "自分の強みをどう伝えればいいか分からない", ack: "強みの言語化、外からの目線が役立つ部分ですよね。" },
        { label: "どんなお客様に向けた事業か整理できていない", ack: "ターゲットの整理、最初の重要なステップですよね。" },
        { label: "開業に必要な準備が多すぎて分からない", ack: "やることが多いと、迷子になりますよね。" },
        { label: "周りに相談できる人がいない", ack: "一人で進めるのは、心細いですよね。" },
      ],
    },
  },
  {
    // Q3: 原因の深掘り
    existing: {
      label: "原因の深掘り",
      text: "その状態が続いている一番の理由は何だと思いますか?",
      choices: [
        { label: "発信・更新にかける時間がない", ack: "日々の業務で手が回らないの、よく分かります。" },
        { label: "何を打ち出すべきか整理できていない", ack: "強みの言語化、外部の目線が役立つ部分ですよね。" },
        { label: "今のサイトや資料が古いまま", ack: "事業のフェーズと今の見せ方にズレが出てきているのかもしれませんね。" },
        { label: "相談できる相手がいなかった", ack: "相談先が定まらないと、後回しになりがちですよね。" },
      ],
    },
    starting: {
      label: "原因の深掘り",
      text: "その状態になっている一番の理由は何だと思いますか?",
      choices: [
        { label: "本業や準備で時間が取れていない", ack: "準備と並行するのは、簡単ではないですよね。" },
        { label: "何から手をつけるべきか順番が分からない", ack: "順番が見えないと、動き出しにくいですよね。" },
        { label: "知識や経験が不足していると感じる", ack: "初めてのことばかりで、不安になりますよね。" },
        { label: "頼れる相談先が見つからなかった", ack: "相談先探し自体が、意外とハードルになりますよね。" },
      ],
    },
  },
  {
    // Q4: なぜ今か
    existing: {
      label: "なぜ今か",
      text: "なぜ“今”このタイミングで変えたいと思われたんですか?",
      choices: [
        { label: "事業拡大・新展開のタイミングだから", ack: "攻めのタイミング、大事にしたいですよね。" },
        { label: "このままでは機会損失になると感じたから", ack: "危機感がある時ほど動くべきタイミングですよね。" },
        { label: "競合や市場の変化を感じているから", ack: "周りの動きが後押しになること、ありますよね。" },
        { label: "事業を見直す余裕ができたから", ack: "見直せる今だからこそ、できることがありますね。" },
      ],
    },
    starting: {
      label: "なぜ今か",
      text: "なぜ“今”始めようと思われたんですか?",
      choices: [
        { label: "ずっと温めてきたことにようやく踏み出せるから", ack: "温めてきたことに踏み出す、いいタイミングですね。" },
        { label: "きっかけとなる出来事があったから", ack: "そのきっかけ、大事にしたいですね。" },
        { label: "周りに背中を押されたから", ack: "背中を押してくれる存在、心強いですよね。" },
        { label: "今しかないと感じたから", ack: "今だと感じたその直感、大切にしていいと思います。" },
      ],
    },
  },
  {
    // Q5: 目指す状態
    existing: {
      label: "目指す状態",
      text: "半年後、事業がどんな状態になっていたら成功と言えますか?",
      choices: [
        { label: "新規のお客様が安定して増えている", ack: "数字で見える変化、分かりやすい成果ですよね。" },
        { label: "価格ではなく価値で選ばれている", ack: "価格競争から抜け出せる状態、大きいですよね。" },
        { label: "サイトや資料が営業ツールとして機能している", ack: "資料が自分の代わりに営業してくれる状態、理想的ですよね。" },
        { label: "自分の手を離れても回る仕組みができている", ack: "属人化から抜け出せる状態、いいですね。" },
      ],
    },
    starting: {
      label: "目指す状態",
      text: "半年後、事業がどんな状態になっていたら「始めてよかった」と思えますか?",
      choices: [
        { label: "事業として形になり、動き出せている", ack: "形になっている状態、まずはそこが一つのゴールですよね。" },
        { label: "最初のお客様ができている", ack: "最初の一人、大きな意味がありますよね。" },
        { label: "自分の強みや方向性に自信が持てている", ack: "自信を持って語れる状態、これから作っていけますね。" },
        { label: "無理のないペースで続けられている", ack: "続けられる形、最初から意識しておきたいですよね。" },
      ],
    },
  },
];

// Q6: ニーズの特定 — shared by both stages.
const NEEDS_QUESTION: Question = {
  label: "ニーズの特定",
  text: "そこに近づくために、今一番手をつけたいのはどんなことですか?複数選んでいただいても構いません。",
  multiSelect: true,
  choices: [
    { label: "サイトのこと", ack: "サイトから見直したいんですね、よく分かりました。", category: "WEB" },
    { label: "予約や注文の仕組みのこと", ack: "日々の運用の仕組みからなんですね、よく分かりました。", category: "APP" },
    { label: "写真や動画で見せ方を変えること", ack: "見せ方からなんですね、よく分かりました。", category: "PHOTO_VIDEO" },
    { label: "まだ何からかは分からない", ack: "そこも含めて、一緒に整理していきましょう。", category: "UNDECIDED" },
  ],
};

export const TOTAL_QUESTIONS = 1 + STAGED_QUESTIONS.length + 1;

// step is 1-indexed. Before the stage is known only step 1 is reachable; a
// null stage anywhere later falls back to the "existing" wording.
export function getQuestion(step: number, stage: BusinessStage | null): Question {
  if (step <= 1) return STAGE_QUESTION;
  if (step >= TOTAL_QUESTIONS) return NEEDS_QUESTION;
  return STAGED_QUESTIONS[step - 2][stage ?? "existing"];
}

// Combination-specific acks for the multi-select question. Keys are the
// selected categories, sorted and joined with "+". Anything not listed here
// (e.g. combined with UNDECIDED) falls back to MULTI_ACK_FALLBACK.
const MULTI_ACKS: Record<string, string> = {
  "APP+WEB": "サイトと予約・注文の仕組み、両方まとめて考えられているんですね。",
  "PHOTO_VIDEO+WEB": "サイトと写真・動画、見せ方をセットで考えられているんですね。",
  "APP+PHOTO_VIDEO": "日々の仕組みと見せ方、両面から整えたいんですね。",
  "APP+PHOTO_VIDEO+WEB": "サイト・仕組み・見せ方、全体をまとめて見直したいんですね。",
};

export const MULTI_ACK_FALLBACK = "複数の視点から教えてくださり、ありがとうございます。";

export function multiChoiceAck(categories: readonly Category[]): string {
  return MULTI_ACKS[[...categories].sort().join("+")] ?? MULTI_ACK_FALLBACK;
}

export const CLOSING_MESSAGE =
  "ありがとうございます。悩みの根っこと、目指したい未来、かなり見えてきました。ここから先——それをどう形にするかは、正直、対話でしか見えてこない領域です。ここまでの内容はそのまま伊藤に共有しておくので、次は直接お話ししながら一緒に形にしていきましょう。";

export const PRIVACY_NOTICE = "入力内容は、代表・伊藤への連絡のためだけに使用します。";

// A session may spend at most one extra follow-up turn per question before the
// server forces progression to the next fixed question.
export const MAX_FOLLOWUPS_PER_QUESTION = 1;

// Hard ceiling on user turns in a single session, independent of follow-ups —
// a last-resort guard against runaway usage even if the free-text path is
// used for every question.
export const MAX_USER_TURNS = 14;

export const MAX_FREE_TEXT_LENGTH = 300;

// Fallback only — used when the API call for a free-text answer fails, so the
// conversation never stalls even if Claude is unreachable.
export const FALLBACK_ACK = "教えてくださり、ありがとうございます。";
