import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Inter_Tight } from "next/font/google";
import { PixelScripts } from "@/components/tracking/pixel-scripts";
import { TrackingProvider } from "@/components/tracking/tracking-provider";
import { SiteChrome } from "@/components/site-chrome";
import {
  BRAND_LINE,
  HOME_FAQS,
  HOME_PULL_LINE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/constants";
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
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: "/brand/btf-logo-icon-mark.png",
    apple: "/brand/btf-logo-icon-mark.png",
  },
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    siteName: SITE_NAME,
    description: HOME_PULL_LINE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: HOME_PULL_LINE,
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
        slogan: BRAND_LINE,
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
      <body
        suppressHydrationWarning
        className={cn(
          "relative flex min-h-screen flex-col bg-[#F5F9FC] font-sans antialiased",
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PixelScripts />
        <TrackingProvider>
          <SiteChrome>{children}</SiteChrome>
        </TrackingProvider>
        <Analytics />
      </body>
    </html>
  );
}
