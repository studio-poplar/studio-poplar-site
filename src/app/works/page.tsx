import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import WorksFilter from "@/components/WorksFilter";
import CtaBand from "@/components/CtaBand";
import { works } from "@/data/works";

export const metadata: Metadata = {
  title: "WORKS",
  description:
    "Studio PoplarのWEB制作／3Dモデリング活用WEB制作／アプリ制作の実績一覧。カテゴリで絞り込んでご覧いただけます。",
};

export default function WorksPage() {
  return (
    <>
      <PageHero
        index="WORKS"
        eyebrow="SELECTED WORKS"
        title="制作実績"
        description="WEB制作、3Dモデリング活用WEB制作、アプリ制作の3領域から実績を掲載しています。カテゴリで絞り込んでご覧ください。"
      />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <WorksFilter works={works} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
