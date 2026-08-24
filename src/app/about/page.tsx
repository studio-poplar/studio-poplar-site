import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import AboutBlock from "@/components/AboutBlock";
import Credentials from "@/components/Credentials";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "ABOUT",
  description:
    "Studio Poplarについて。事業やお店の“らしさ”を構造として捉え、新規事業・個人開業の立ち上げに伴走する制作スタジオの考え方をご紹介します。",
};

const OVERVIEW_CREDENTIALS = [
  { k: "FOCUS", v: "事業の骨格設計" },
  { k: "APPROACH", v: "Web × App × Brand" },
  { k: "STYLE", v: "構想から実装まで" },
];

export default function AboutPage() {
  return (
    <>
      <PageMasthead
        eyebrow="ABOUT"
        title="事業の構造を、見立てる。"
        description="Studio Poplarは、装飾よりも先に構造を設計する制作スタジオです。新規事業・個人開業の立ち上げに伴走し、Webとアプリという形で事業の輪郭を描きます。"
      />

      <section className="section">
        <div className="wrap">
          <Reveal>
            <AboutBlock
              index="01 — PHILOSOPHY"
              quote="“ものごとの構造を見立てる力で、事業の伝わり方を設計する。”"
              body="事業やお店の魅力は、色やレイアウトといった装飾の前に、誰に・何を・どの順番で伝えるかという構造でほとんど決まります。Studio Poplarは、その構造をソフトウェアの設計図を組み立てるように設計します。新規事業や個人開業では、事業の顔となるWebサイトやアプリが唯一の接点になることも少なくありません。骨格から仕上げまでを一貫して設計することで、立ち上げ期から信頼を積み上げられる状態を目指します。"
            />
          </Reveal>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal>
            <AboutBlock
              index="02 — OVERVIEW"
              quote="事業の骨格を見つけ、伝わる形にする。"
              body="Studio Poplarは、事業やお店の“らしさ”を表面的なデザインではなく、その根底にある構造から捉えます。何を届け、誰に選ばれ、どう続いていくのか。その骨格を整理し、Webとアプリを通じて伝わる形へと設計します。"
            />
          </Reveal>
          <Credentials items={OVERVIEW_CREDENTIALS} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="03" label="TARGET" title="こんな方を支援しています" />
          </Reveal>
          <div className="grid-3">
            <ServiceCard tag="STARTUP" title="新規事業担当者" description="事業アイデアを整理し、立ち上げまで伴走してほしい方" revealDelay={50} />
            <ServiceCard tag="FREELANCE" title="個人事業主" description="開業準備や集客導線を整えたい方" revealDelay={140} />
            <ServiceCard tag="SMALL BUSINESS" title="小規模事業者" description="Webや業務の仕組みを見直し、事業成長につなげたい方" revealDelay={230} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
