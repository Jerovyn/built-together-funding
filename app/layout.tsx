import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter_Tight } from "next/font/google";
import { BoltAssistant } from "@/components/mascot/bolt-assistant";
import { PixelScripts } from "@/components/tracking/pixel-scripts";
import { TrackingProvider } from "@/components/tracking/tracking-provider";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_DESCRIPTION, SITE_NAME, HOME_FAQS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: `${SITE_NAME} | Capacity capital for service businesses`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/brand/btf-logo-icon-mark.png",
    apple: "/brand/btf-logo-icon-mark.png",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://builttogetherfunding.com";
  const phone = process.env.NEXT_PUBLIC_PHONE?.trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Built Together Funding Corp",
        alternateName: SITE_NAME,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/brand/btf-logo-icon-mark.png`,
        slogan: "Funding is a commitment to growth.",
        description: SITE_DESCRIPTION,
        ...(phone ? { telephone: phone } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: SITE_NAME,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: HOME_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <html lang="en" className={interTight.variable} suppressHydrationWarning>
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly, etc.)
          inject attributes into <html>/<body> before React hydrates. */}
      <body
        suppressHydrationWarning
        className={cn(
          "flex min-h-screen flex-col bg-btf-bg font-sans antialiased",
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PixelScripts />
        <TrackingProvider>
          <SiteHeader />
          <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
          <SiteFooter />
          <BoltAssistant />
          <StickyMobileCta />
        </TrackingProvider>
      </body>
    </html>
  );
}
