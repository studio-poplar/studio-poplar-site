// Shared conversation-flow definitions for the AI hearing chat (hybrid v2).
//
// The question skeleton is fixed by spec and must never be reordered or skipped.
// Chip answers are resolved entirely client-side against a hand-matched
// acknowledgment (no API call, no interpretation, cannot go "off-topic").
// Free text ("その他" or direct typing) is the only path that calls the API,
// and only that single question's text + answer is sent — not the full
// conversation history — to keep each call small and cheap.

export type Category = "WEB" | "APP" | "PHOTO_VIDEO" | "UNDECIDED";

export type Choice = {
  label: string;
  ack: string;
  category?: Category;
};

export type Question = {
  label: string;
  text: string;
  choices: readonly Choice[];
  multiSelect?: boolean;
};

export const INTRO_MESSAGE =
  "はじめまして。ここでは肩の力を抜いて、思っていることをそのまま話してください。うまく整理できていなくても大丈夫です。";

export const QUESTIONS: readonly Question[] = [
  {
    label: "感情の入口",
    text: "これまで事業をされてきて、「本当はこう伝えたいのに、うまく伝わっていないな」と感じた瞬間はありますか?",
    choices: [
      { label: "初回のお打ち合わせで", ack: "初回の場でそう感じるのは、よくあることです。" },
      { label: "見積もりや価格の説明で", ack: "価格の話になると、伝えたいことが霞んでしまうこと、ありますよね。" },
      { label: "ホームページや資料を見せたときに", ack: "見せた瞬間の反応で、伝わっていなさに気づくこと、ありますよね。" },
      { label: "SNSや口コミの反応で", ack: "外からの見え方とのズレ、気になりますよね。" },
    ],
  },
  {
    label: "悩みの深掘り(具体化)",
    text: "その”伝わらなさ”は、具体的にはどんな場面で感じますか?",
    choices: [
      { label: "商品・サービスの良さが伝わらない", ack: "良さの核心が伝わりきらないの、もどかしいですよね。" },
      { label: "他社との違いが伝わらない", ack: "差別化ポイントが伝わらないのは、じわじわ効いてきますよね。" },
      { label: "想いや背景が伝わらない", ack: "想いの部分こそ、一番言葉にしづらいですよね。" },
      { label: "価格に見合う価値が伝わらない", ack: "価値と価格のギャップ、伝え方次第で変わる部分ですよね。" },
    ],
  },
  {
    label: "悩みの深掘り(原因)",
    text: "その状態が続いている一番の理由は何だと思いますか?",
    choices: [
      { label: "言葉にする時間が取れていない", ack: "日々の忙しさの中で、言語化の時間は後回しになりがちですよね。" },
      { label: "何が強みか自分でも整理できていない", ack: "自分自身、一番近くにいるからこそ見えにくいものですよね。" },
      { label: "今のサイトや資料が古いまま", ack: "作った当時と今とで、伝えたいことが変わってきているのかもしれませんね。" },
      { label: "誰に頼めばいいか分からなかった", ack: "相談先が見つからないと、後回しになってしまいますよね。" },
    ],
  },
  {
    label: "なぜ今なのか",
    text: "今までも同じ感覚はあったと思いますが、なぜ”今”変えたいと思われたんですか?",
    choices: [
      { label: "新しい挑戦や転機のタイミングだから", ack: "節目のタイミング、大事にしたいですよね。" },
      { label: "このままでは機会を逃すと感じたから", ack: "危機感がある時ほど、動くべきタイミングですよね。" },
      { label: "周りの変化に後押しされたから", ack: "周囲の変化がきっかけになること、多いですよね。" },
      { label: "ふと立ち止まって考える時間ができたから", ack: "立ち止まれた今だからこそ、見えてきたものがあるんですね。" },
    ],
  },
  {
    label: "将来像",
    text: "理想を自由に言っていいとしたら、半年後、事業がどんな状態になっていてほしいですか?",
    choices: [
      { label: "自分の言葉で自信を持って説明できている", ack: "自分の言葉で語れる状態、理想的ですよね。" },
      { label: "新規のお客様が自然と増えている", ack: "伝わることの先に、その変化が生まれるんですよね。" },
      { label: "価格ではなく想いで選ばれている", ack: "価格じゃない軸で選ばれるの、大きな違いですよね。" },
      { label: "少し肩の力を抜いて運営できている", ack: "無理なく続けられる状態、実はすごく大事ですよね。" },
    ],
  },
  {
    label: "ニーズの特定",
    text: "そこに近づくために、今一番手をつけたいのはどんなことですか?複数選んでいただいても構いません。",
    multiSelect: true,
    choices: [
      { label: "サイトのこと", ack: "サイトから見直したいんですね、よく分かりました。", category: "WEB" },
      { label: "予約や注文の仕組みのこと", ack: "日々の運用の仕組みからなんですね、よく分かりました。", category: "APP" },
      { label: "写真や動画で見せ方を変えること", ack: "見せ方からなんですね、よく分かりました。", category: "PHOTO_VIDEO" },
      { label: "まだ何からかは分からない", ack: "そこも含めて、一緒に整理していきましょう。", category: "UNDECIDED" },
    ],
  },
] as const;

export const CLOSING_MESSAGE =
  "ありがとうございます。悩みの根っこと、目指したい未来、かなり見えてきました。ここから先——それをどう形にするかは、正直、対話でしか見えてこない領域です。ここまでの内容はそのまま伊藤に共有しておくので、次は直接お話ししながら一緒に形にしていきましょう。";

export const PRIVACY_NOTICE = "入力内容は、代表・伊藤への連絡のためだけに使用します。";

export const TOTAL_QUESTIONS = QUESTIONS.length;

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
