"use client";

import Script from "next/script";

/**
 * Loads GA4 / Google Ads (gtag.js) and Meta Pixel only when the corresponding
 * NEXT_PUBLIC_* env vars are set at build time. No IDs are hardcoded.
 */
export function PixelScripts() {
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID?.trim();
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

  const gtagBootstrapId = ga4 ?? adsId;

  return (
    <>
      {gtagBootstrapId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagBootstrapId}`}
            strategy="afterInteractive"
          />
          <Script id="btf-gtag-init" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${ga4 ? `gtag('config', '${ga4}');` : ""}
${adsId && adsId !== ga4 ? `gtag('config', '${adsId}');` : ""}
            `.trim()}
          </Script>
        </>
      ) : null}

      {metaId ? (
        <Script id="btf-meta-pixel" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaId}');
fbq('track', 'PageView');
          `.trim()}
        </Script>
      ) : null}
    </>
  );
}
