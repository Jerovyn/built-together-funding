import type { Metadata } from "next";
import { DisclaimerNote } from "@/components/disclaimer-note";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import {
  DISCLAIMER_PREQUAL_LINE,
  LEGAL_CAPACITY_PHILOSOPHY_LINE,
  LEGAL_NO_GUARANTEE_LINE,
  ROUTES,
  SITE_NAME,
} from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms governing use of the ${SITE_NAME} website and pre-screen experience.`,
};

const prose =
  "space-y-4 text-sm leading-relaxed text-btf-text-muted md:text-base";

export default function TermsPage() {
  return (
    <>
      <MarketingPageHero
        badge="Legal"
        title="Terms of Use"
        description={`Rules for using this website and submitting information to ${SITE_NAME}. Last updated: May 7, 2026.`}
      />

      <SectionShell className="border-b border-btf-border bg-btf-bg">
        <div className="mx-auto max-w-3xl space-y-8">
          <Card className="bg-btf-card">
            <CardContent className="space-y-3 p-6 md:p-8">
              <p className="text-sm font-medium text-btf-text">
                {DISCLAIMER_PREQUAL_LINE}
              </p>
              <p className="text-sm text-btf-text-muted">{LEGAL_NO_GUARANTEE_LINE}</p>
              <p className="text-sm text-btf-text-muted">
                {LEGAL_CAPACITY_PHILOSOPHY_LINE}
              </p>
            </CardContent>
          </Card>
          <DisclaimerNote />
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-btf-secondary">
        <div className="mx-auto max-w-3xl space-y-14">
          <section className="space-y-6">
            <SectionHeading title="Acceptance of terms" />
            <div className={prose}>
              <p>
                By accessing this website or submitting information through it, you
                agree to these Terms of Use and our{" "}
                <Link
                  href="/privacy-policy/"
                  className="text-btf-accent-soft underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                . If you do not agree, do not use the site or submit the pre-screen.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Website use" />
            <div className={prose}>
              <p>
                You agree to use this site only for lawful purposes and in a way that
                does not interfere with its operation. You will not attempt to scrape,
                overload, or misuse the site, and you will not submit false or
                misleading information.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="No funding guarantee" />
            <div className={prose}>
              <p>{LEGAL_NO_GUARANTEE_LINE}</p>
              <p>{DISCLAIMER_PREQUAL_LINE}</p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Pre-qualification is not approval" />
            <div className={prose}>
              <p>
                A pre-screen, questionnaire, or conversation is not an underwriting
                decision and it is not an offer of credit. Any decision about funding
                requires separate review, verification, and partner availability.{" "}
                {DISCLAIMER_PREQUAL_LINE}
              </p>
            </div>
          </section>
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-btf-bg">
        <div className="mx-auto max-w-3xl space-y-14">
          <section className="space-y-6">
            <SectionHeading title="User-submitted information" />
            <div className={prose}>
              <p>
                If you submit the pre-screen, you authorize {SITE_NAME} to use the
                information you provide to evaluate fit, contact you, and coordinate
                with partners or service providers as needed to move a potential
                opportunity forward.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Accuracy of information" />
            <div className={prose}>
              <p>
                You agree to provide information that is truthful to the best of your
                knowledge. If something changes materially after you submit, you
                should tell us so we do not rely on outdated details.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Communication consent" />
            <div className={prose}>
              <p>
                If you provide contact details and the consents requested on the form,
                you agree we may contact you using those channels for purposes related
                to your submission. Email consent is required to submit the
                pre-screen. SMS is optional and governed by the disclosures shown at
                the time you opt in.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="SMS opt-out" />
            <div className={prose}>
              <p>
                If you receive SMS messages from us, you can opt out by replying{" "}
                <span className="font-medium text-btf-text">STOP</span> (or following
                the instructions in the message). Message and data rates may apply.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="No financial or legal advice" />
            <div className={prose}>
              <p>
                Nothing on this website is financial, tax, or legal advice. Speak with
                qualified professionals about your situation before making decisions
                about borrowing, entity structure, contracts, or risk.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Limitation of liability" />
            <div className={prose}>
              <p>
                To the fullest extent permitted by law, {SITE_NAME} and its team are not
                liable for indirect, incidental, special, consequential, or punitive
                damages arising from your use of the site - or from any decision you
                make after using it.
              </p>
              <p>
                Some jurisdictions do not allow certain limitations. If that applies to
                you, some limitations may not apply, and you may have other rights.
              </p>
              <p className="text-xs text-btf-text-muted">
                This limitation language is a common placeholder and should be tailored
                by counsel for your entity structure, insurance, and operating
                footprint.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Changes to terms" />
            <div className={prose}>
              <p>
                We may update these terms from time to time. When we do, we will revise
                the &quot;last updated&quot; date at the top of this page (and may add a notice on
                the site if the changes are material).
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Contact" />
            <div className={prose}>
              <p>
                Questions about these terms: visit{" "}
                <Link
                  href={ROUTES.contact}
                  className="text-btf-accent-soft underline-offset-4 hover:underline"
                >
                  Contact
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Attorney review note" />
            <div className={prose}>
              <p>
                These Terms of Use are a working draft and should be finalized with
                legal counsel before paid launch or any broad public marketing push.
              </p>
            </div>
          </section>
        </div>
      </SectionShell>
    </>
  );
}
