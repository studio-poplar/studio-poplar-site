import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import SectionHead from "@/components/SectionHead";
import TargetCard from "@/components/TargetCard";
import AboutBlock from "@/components/AboutBlock";
import TeamProfile from "@/components/TeamProfile";
import CompanyInfo from "@/components/CompanyInfo";
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
              tag="FREELANCER"
              who="フリーランス"
              voice="実績はあるのに、初めての相手に強みが一言で伝わらない。"
              approach="肩書きと実績の羅列では、初見のクライアントとの違いは伝わりません。まず「誰のどんな課題を解決してきたか」をヒアリングで掘り起こし、依頼前に相手が抱く不安へ先回りして答えるポートフォリオに組み立てます。プロフィール写真や制作風景の撮影も合わせて、人柄まで伝わる第一印象をつくります。"
              services={["WEB", "PHOTO & VIDEO"]}
              accent="var(--brand)"
              revealDelay={50}
            />
            <TargetCard
              tag="SELF-EMPLOYED"
              who="個人事業主"
              voice="本業で手一杯で、集客も予約の対応も後回しになっている。"
              approach="一人で営業から事務まで担う方に、凝ったサイトは必要ありません。まず「問い合わせ・予約までの最短ルート」を決め、更新の手間が増えない最小限の構成でつくります。電話やDMでの予約管理が負担なら、予約の仕組みの導入もご提案。更新を自分で続けられるCMS対応も可能です。"
              services={["WEB", "APP"]}
              accent="var(--second)"
              revealDelay={140}
            />
            <TargetCard
              tag="BUSINESS OWNER"
              who="すでにお店やサイトがある方"
              voice="お店もサイトもあるのに、価値が伝わっていない気がする。"
              approach="作り直す前に、まず現状を診ます。問い合わせが少ない、価格で比べられてしまう——どの場面で機会を逃しているかを洗い出し、原因が見せ方か、導線か、情報の順番かを切り分けます。全面リニューアルではなく、効果の大きい箇所から段階的に直す進め方も選べます。営業と採用の現場で「選ぶ側が何を見て決めるか」を見てきた視点で整理します。"
              services={["WEB", "APP", "PHOTO & VIDEO"]}
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

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="04" label="COMPANY" title="会社情報" />
          </Reveal>
          <Reveal>
            <CompanyInfo />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
