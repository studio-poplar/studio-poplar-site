import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";

// lazyOnload: GA (~170 KB) loads after the page is idle so it does not delay first paint or input.
// Events fired before it loads are dropped (trackEvent checks for window.gtag).
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
