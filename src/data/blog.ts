export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-structure-first",
    category: "DESIGN",
    title: "見た目の前に、構造から設計する理由",
    date: "2026-07-02",
    excerpt:
      "Studio Poplarが装飾よりも先に“構造”を見立てる理由について。新規事業のWebサイト設計で最初に着手すべきことをまとめました。",
    body: [
      "新規事業や個人開業のWebサイト制作では、色やフォントといった装飾の前に、事業がどう伝わるべきかという“構造”を先に決めることを重視しています。",
      "構造とは、誰に・何を・どの順番で伝え、どこで行動（問い合わせや購入）につなげるかという設計図のようなものです。この骨格が固まっていないまま見た目を作り込んでも、事業の魅力は正しく伝わりません。",
      "本記事は準備中のダミーコンテンツです。今後、実際の制作プロセスに基づいた記事に差し替えていきます。",
    ],
  },
  {
    slug: "3d-web-when-it-works",
    category: "3D WEB",
    title: "3Dモデリングが効くWebサイトの見極め方",
    date: "2026-07-18",
    excerpt:
      "すべての事業に3D表現が必要なわけではありません。3Dモデリング活用WEBが効果を発揮する条件を整理しました。",
    body: [
      "3Dモデリングを活用したWebサイトは強い体験価値を生みますが、すべての事業に必要というわけではありません。",
      "空間・プロダクトの“質感”や“間取り”が購買判断に直結する業種（宿泊・不動産・プロダクトなど）では効果が大きい一方、情報伝達が主目的のサイトでは過剰な演出になりがちです。",
      "本記事は準備中のダミーコンテンツです。今後、実際の制作事例に基づいた記事に差し替えていきます。",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
