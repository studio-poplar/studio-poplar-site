export type HeroSlide = {
  key: string;
  tag: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  // Optional media, drawn under the gradient. Drop a file into /public/hero and
  // set one of these; nothing else in the layout needs to change.
  image?: string;
  // Played muted, looped and inline, and only while its slide is showing.
  video?: { src: string; poster?: string };
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    key: "web",
    tag: "WEB",
    title: "伝わる“顔”を、つくる。",
    text: "事業の顔になるサイトを、設計から制作まで。",
    href: "/works?category=web",
    cta: "WEB制作を見る",
    image: "/hero/web.jpg",
  },
  {
    key: "app",
    tag: "APP",
    title: "日々の運用を、支える。",
    text: "予約や会員管理の負担を、仕組みで減らします。",
    href: "/works?category=app",
    cta: "アプリ制作を見る",
    image: "/hero/app.jpg",
  },
  {
    key: "photo",
    tag: "PHOTO & VIDEO",
    title: "雰囲気ごと、残す。",
    text: "写真と映像で、伝わる空気をつくります。",
    href: "/works?category=photo-video",
    cta: "撮影事例を見る",
    image: "/hero/photo.jpg",
  },
  {
    key: "drone",
    tag: "DRONE",
    title: "空からの視点を、味方に。",
    text: "上空からの映像で、場所の魅力を伝えます。",
    href: "/service/drone",
    cta: "ドローン撮影を見る",
    image: "/hero/drone.jpg",
  },
];
