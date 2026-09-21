import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageMasthead from "@/components/PageMasthead";
import WorksIndex from "@/components/WorksIndex";
import CtaBand from "@/components/CtaBand";
import { works } from "@/data/works";

export const metadata: Metadata = pageMetadata({
  title: "制作実績｜WEBサイト・アプリ・写真動画",
  description: "Studio PoplarのWEBサイト制作、アプリ制作、写真・動画撮影の制作実績一覧。実際の画面やご依頼の背景をご覧いただけます。",
  path: "/works",
});

export default function WorksPage() {
  return (
    <>
      <PageMasthead
        eyebrow="SELECTED WORKS"
        title="制作実績"
        description="WEB制作、アプリ制作、写真・動画撮影の実績を掲載しています。"
      />

      <section className="section soft" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <WorksIndex works={works} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
