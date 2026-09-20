import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import { AREA_ICONS } from "@/components/serviceIcons";
import WorkCard from "@/components/WorkCard";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { works, getWorkBySlug } from "@/data/works";
import styles from "./page.module.css";

const PREVIEW_WORK_SLUGS = ["the-gallery", "coco-yoga", "tabikoyomi-coffee"];

// Same card as the AREAS section on /service; here each one also shows typical requests.
const SERVICES = [
  {
    num: "WEB",
    title: "サイトをつくる",
    description: "はじめての開業やお店の“顔”になるサイトを、話を聞きながらつくります。",
    items: ["パン屋を新しく開きます", "小さな美容室を開きます", "町の工務店です"],
    price: "5万円〜",
    icon: AREA_ICONS.web,
    accent: "var(--brand)",
  },
  {
    num: "APP",
    title: "仕組みをつくる",
    description: "予約や会員管理、診断など、日々の運用をラクにする仕組みをつくります。",
    items: ["サロンの予約サイトが欲しい", "会員証をアプリにしたい", "簡単な診断コンテンツを作りたい"],
    price: "15万円〜",
    icon: AREA_ICONS.app,
    accent: "var(--system)",
  },
  {
    num: "PHOTO & VIDEO",
    title: "見せ方をつくる",
    description: "写真や映像で、言葉だけでは伝わらない雰囲気を伝えます。",
    items: ["SNSに使う写真がない", "開店に合わせて写真がほしい", "PR用のショート動画を作りたい"],
    price: "6万円〜",
    icon: AREA_ICONS.photo,
    accent: "var(--second)",
  },
];

export default function Home() {
  const previewWorks = PREVIEW_WORK_SLUGS.map((slug) => getWorkBySlug(slug)).filter(
    (work): work is (typeof works)[number] => Boolean(work)
  );

  return (
    <>
      <Hero />

      <section className={`section ${styles.firstSection}`}>
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="01" label="SERVICE" title="何から、かたちにする？" />
          </Reveal>
          <div className="grid-3">
            {SERVICES.map((service, i) => (
              <ServiceCard
                key={service.num}
                num={service.num}
                tag={service.num}
                title={service.title}
                description={service.description}
                eyebrow="こんなご相談も"
                items={service.items}
                price={service.price}
                href="/service"
                icon={service.icon}
                accent={service.accent}
                revealDelay={50 + i * 90}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="02" label="WORKS" title="制作実績" accent />
          </Reveal>
          <div className={`grid-3 ${styles.worksGrid}`}>
            {previewWorks.map((work, i) => (
              <WorkCard key={work.slug} work={work} revealDelay={i * 90} />
            ))}
          </div>
          <div className={styles.centerLink}>
            <Link href="/works" className="btn-ghost">
              WORKS一覧を見る →
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
