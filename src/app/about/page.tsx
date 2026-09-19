import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import SectionHead from "@/components/SectionHead";
import TargetCard from "@/components/TargetCard";
import AboutBlock from "@/components/AboutBlock";
import TeamProfile from "@/components/TeamProfile";
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
        title="伝えたいことを、伝わる形に。"
        description="Studio Poplarという制作スタジオの、考え方と姿勢について。"
      />

      <section className="section">
        <div className="wrap">
          <Reveal>
            <AboutBlock
              num="01"
              label="PHILOSOPHY"
              quote="言葉にできない感覚を、置き去りにしない。"
              body="新しい事業ほど、伝えたいことは多く、言葉にしづらい。Studio Poplarは、直接ヒアリングを通じて、“本当に伝えたかったこと”とのズレなく、サイトやアプリ、写真・映像に落とし込む。"
            />
          </Reveal>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="02" label="TARGET" title="こんなモヤモヤ、ありませんか?" />
          </Reveal>
          <div className="grid-3">
            <TargetCard
              tag="STARTUP"
              who="新しく事業を始める方"
              voice="やりたいことは頭にある。でも、何から決めればいいのか分からない。"
              approach="まずはチャットやヒアリングで、頭の中にあることを一緒に言葉にします。誰に何を伝えるかを固めてから、必要なものだけをつくります。"
              entries={[{ label: "WEB", price: "5万円〜" }]}
              accent="var(--brand)"
              revealDelay={50}
            />
            <TargetCard
              tag="FREELANCE"
              who="個人で開業する方"
              voice="自分の強みが、自分ではうまく言葉にできない。"
              approach="ご自身が当たり前だと思っている強みを、対話の中から引き出します。サイトの言葉と、人柄が伝わる写真・映像で「あなたらしさ」を形にします。"
              entries={[
                { label: "WEB", price: "5万円〜" },
                { label: "PHOTO", price: "6万円〜" },
              ]}
              accent="var(--second)"
              revealDelay={140}
            />
            <TargetCard
              tag="SMALL BUSINESS"
              who="すでにお店やサイトがある方"
              voice="今の見せ方が、伝えたいこととズレている気がする。"
              approach="作り直す前に、どこがズレているのかを一緒に確認します。見せ方の整理に加えて、日々の運用を支えるアプリ化のご相談も可能です。"
              entries={[
                { label: "WEB", price: "5万円〜" },
                { label: "APP", price: "15万円〜" },
              ]}
              accent="var(--system)"
              revealDelay={230}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="03" label="TEAM" title="Our Team" />
          </Reveal>
          <Reveal>
            <TeamProfile />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
