import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import MockWorkNotice from "@/components/MockWorkNotice";
import WorkPostFull from "@/components/WorkPostFull";
import CtaBand from "@/components/CtaBand";
import { works } from "@/data/works";

export const metadata: Metadata = {
  title: "WORKS",
  description: "Studio PoplarのWEB制作／3Dモデリング活用WEB制作／アプリ制作の実績一覧。",
};

export default function WorksPage() {
  return (
    <>
      <PageMasthead
        eyebrow="SELECTED WORKS"
        title="制作実績"
        description="WEB制作、3Dモデリング活用WEB制作、アプリ制作の3領域から実績を掲載しています。"
      />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <MockWorkNotice />
          {works.map((work) => (
            <WorkPostFull key={work.slug} work={work} />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
