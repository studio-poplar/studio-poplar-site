import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import AboutBlock from "@/components/AboutBlock";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "ABOUT",
  description: "Studio Poplarについて。伝えたいことを、伝わる形にする制作スタジオの考え方をご紹介します。",
};

export default function AboutPage() {
  return (
    <>
      <PageMasthead
        eyebrow="ABOUT"
        title="伝えたいことは、伝わるとは限らない。"
        description="その前提から、一緒に始めます。"
      />

      <section className="section">
        <div className="wrap">
          <Reveal>
            <AboutBlock
              index="01 — PHILOSOPHY"
              quote="言葉にできない感覚を、置き去りにしない。"
              body="新しい事業ほど、伝えたいことが多く、言葉にしづらい瞬間がある。Studio Poplarは、代表の伊藤が直接ヒアリングしてその感覚を言葉にしたうえで、サイトやアプリ、写真・映像のかたちに落とし込む。装飾より、“本当に伝えたかったこと”とのズレのなさを優先する。"
            />
          </Reveal>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="02" label="TARGET" title="こんな方へ" />
          </Reveal>
          <div className="grid-3">
            <ServiceCard tag="STARTUP" title="新しく事業を始める方" description="何から手をつければいいか、まだ整理できていない" revealDelay={50} />
            <ServiceCard tag="FREELANCE" title="個人で開業する方" description="自分の強みを、うまく言葉にできない" revealDelay={140} />
            <ServiceCard tag="SMALL BUSINESS" title="すでにお店やサイトがある方" description="今の見せ方が、伝えたいこととズレている気がする" revealDelay={230} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
