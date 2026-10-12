This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# デシイリ（/deshiiri）

横浜・神奈川の職人と家業の読みもの。運営：Studio Poplar。

## 置き場所

本業サイトのリポジトリの中に、route group `src/app/(deshiiri)/deshiiri/` として置いている（Multi-Zones の別プロジェクトにはしていない）。
専用の `layout.tsx` がデシイリのヘッダー・フッター・明朝体・色を当てる。本業の `SiteHeader` / `SiteFooter` は `/deshiiri` 以下では何も表示しない。
CSS 変数は `.deshiiri` の中だけで定義している（`deshiiri.css`）。

| 場所 | 中身 |
|---|---|
| `content/deshiiri/articles/*.mdx` | 記事（帖） |
| `content/deshiiri/shokunin/*.yaml` | 職人・家業 |
| `content/deshiiri/banzuke.json` | 読まれ番付 |
| `content/deshiiri/banned-words.json` | 使わない言葉 |
| `public/deshiiri/articles/<slug>/` | 記事の写真 |
| `public/deshiiri/shokunin/<id>/` | 職人の写真 |
| `src/lib/deshiiri/codes.ts` | 仕事・町・連載のコードと表示名 |
| `src/lib/deshiiri/kojo.ts` | 口上（トップと /deshiiri/about） |

## 帖の足し方

1. 職人がまだいなければ、先に「職人の足し方」で YAML を作る
2. `content/deshiiri/articles/<slug>.mdx` を作る。`<slug>` が URL になる（例 `tatami-fujisawa` → `/deshiiri/articles/tatami-fujisawa`）
3. 先頭に次を書く

   ```yaml
   ---
   no: 25                      # 第二十五帖（漢数字は自動）
   title: "知られていない一点から付けた題"
   shokunin: "<職人の id>"     # 仕事・町は職人の YAML から引く
   lead: "一覧と共有に使う2〜3行の要約"
   midokoro:                   # 見どころ 2〜3個
     - "…"
     - "…"
   hero: "/deshiiri/articles/<slug>/hero.jpg"
   heroAlt: "写真の説明"
   heroCaption: "写真の下に出す説明（なくてもよい）"
   publishedAt: "2026-12-01"
   interviewedAt: "2026-11"
   featured: false             # true の中で一番新しい帖が「今月の特集」
   series: null                # 連載なら dougu / shigotogi / hirumeshi
   related: []                 # 次に読む。空なら 同じ仕事 → 同じ町 → 新しい順 で自動
   sponsor: null               # 協賛者の名前
   draft: true                 # 確認が済んだら false
   ---
   ```

4. 本文の型（この順番）。章番号（01〜）は自動で付く
   - 最初の段落：リード文
   - `## <日の当たらなかった一点>`：題にした一点を最初に深く書く
   - `## <技の名前>という技`：`<Technique title="…">…</Technique>`、`<Quote by="…">…</Quote>`
   - `## 〇〇の一日`：`<Day items={[{ time: "06:30", text: "…" }]} />`
   - `## 正直に、きついこと`：`<Honest>` の中に箇条書き。**必須**
   - `## 道具・仕事着・昼めし`（短く）
   - 写真：`<Photo src alt caption />`、本文より広い `<WidePhoto … />`、2枚並び `<TwoPhotos left={{…}} right={{…}} />`
5. 写真を `public/deshiiri/articles/<slug>/` に置く（掲載許可を取ったもの。EXIF を消して、長辺 2000px 程度に）。写真がまだないあいだは、写真の説明を書いた仮の地が出る
6. `npm run dev` で `/deshiiri/articles/<slug>` を確認 → `draft: false` にしてコミット

題は「〇〇になるには」「〇〇さんの一日」のような求人型にしない。

## 職人の足し方

`content/deshiiri/shokunin/<id>.yaml` を作る。`<id>` が URL になる（`/deshiiri/meikan/<id>`）。

```yaml
id: "<id>"
yago: "屋号"
person: "Aさん"            # 表記は本人の同意どおり。出さないなら null
job: "tatami"              # codes.ts の JOBS のコード。新しい仕事は JOBS に足す
city: "fujisawa"           # codes.ts の CITIES のコード
area: "藤沢市"
since: null                # 例 "昭和三十年代創業"
intro: "短い紹介（1〜2文）"
photo: "/deshiiri/shokunin/<id>/main.jpg"
contact:                   # false の用件は連絡フォームに出ない
  hanashi: true            # 話を聞いてみたい
  irai: true               # 仕事を頼みたい
  kengaku: true            # 見学してみたい
  deshiiri: true           # 弟子入りの相談
links:
  site: null
  instagram: null
draft: false
```

## 番付の更新のしかた（毎月1日）

1. Vercel の Web Analytics で、前月のページ別閲覧数を開き、`/deshiiri/articles/` 以下の上位を確かめる
2. `content/deshiiri/banzuke.json` を書き換える。上から 横綱・大関・関脇・小結・前頭・前頭 になる

   ```json
   { "month": "2026-11", "items": [{ "slug": "tatami-fujisawa", "views": 2140 }] }
   ```

3. 公開中の帖が6本未満、または `items` が6本そろわないあいだは、番付の代わりに「編集部のおすすめ」（新しい順）が出る

## ビルド時の警告

`npm run build` で次が見つかると `⚠ [deshiiri]` で警告する（ビルドは止めない）。

- 記事に `<Honest>`（正直に、きついこと）がない
- 見どころが2個未満
- 「次に読む」が2本未満
- 記事・職人ファイル、または表示されるページに「使わない言葉」（`banned-words.json`）がある（ページの検査は `scripts/check-deshiiri-words.mjs`）

## 下書き

`draft: true` の帖と職人は、`npm run dev` と Vercel のプレビュー環境だけに出る。本番、sitemap、検索には出ない。
`sample-*` の3帖・3人はモックアップの仮の内容で、すべて下書き。

## 連絡フォーム

`/deshiiri/api/contact` が受け取り、Resend で代表にメール、送った人に自動返信する。職人には直接送らない。
同じ IP から1分3回まで。honeypot あり。送信成功時に Vercel Analytics のイベント `deshiiri_contact`（職人・用件・どの記事から）を送る。

環境変数（`.env.local` と Vercel の両方に設定。値はリポジトリに入れない）

```
RESEND_API_KEY=
DESHIIRI_TO_EMAIL=        # 連絡を受け取るアドレス
DESHIIRI_FROM_EMAIL=      # 例 deshiiri@studiopoplar.com（Resend で studiopoplar.com を認証してから）
```

開発環境でキーが未設定のときは、メールを送らずにサーバーのログに出す。

## 共有画像

`/deshiiri/og`（全体）と `/deshiiri/og/<slug>`（記事ごと。hero 写真に題と千社札を重ねる）を `next/og` で生成する。明朝体はビルド時に Google Fonts から使う文字だけ取得する。
