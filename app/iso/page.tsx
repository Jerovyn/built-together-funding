import type { Metadata } from "next";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { SectionHeading } from "@/components/section-heading";
import { IsoSignupForm } from "@/components/iso/iso-signup-form";
import { DisclaimerNote } from "@/components/disclaimer-note";
import { DISCLAIMER_PREQUAL_LINE, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ISO / Partner Signup",
  description: `Referral and ISO partner signup for ${SITE_NAME}. Simple intake — we follow up with process and expectations.`,
};

export default function IsoSignupPage() {  return (
    <>
      <MarketingPageHero
        badge="ISO / Partner"
        title="Partner with Built Together Funding"
        description="A simple signup for ISOs and referral partners. We will follow up with next steps."
      />

      <SectionShell className="border-b border-btf-border">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Signup"
              title="Keep it simple."
              description="Send your info. We will reach out to discuss fit, process, and expectations."
            />
            <DisclaimerNote className="mt-6">{DISCLAIMER_PREQUAL_LINE}</DisclaimerNote>
          </div>

          <div className="lg:col-span-7">
            <IsoSignupForm />
          </div>
        </div>
      </SectionShell>
    </>
  );
}

