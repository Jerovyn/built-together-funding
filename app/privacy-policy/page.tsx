import type { Metadata } from "next";
import { DisclaimerNote } from "@/components/disclaimer-note";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import {
  DISCLAIMER_PREQUAL_LINE,
  LEGAL_NO_GUARANTEE_LINE,
  ROUTES,
  SITE_NAME,
} from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects information submitted through this website.`,
};

const prose =
  "space-y-4 text-sm leading-relaxed text-btf-text-muted md:text-base";

export default function PrivacyPolicyPage() {
  return (
    <>
      <MarketingPageHero
        badge="Legal"
        title="Privacy Policy"
        description={`How ${SITE_NAME} handles information you share with us through this site and the pre-screen process. Last updated: May 7, 2026.`}
      />

      <SectionShell className="border-b border-btf-border">
        <div className="mx-auto max-w-3xl space-y-8">
          <Card className="bg-btf-card">
            <CardContent className="p-6 md:p-8">
              <p className="text-sm font-medium text-btf-text">
                {DISCLAIMER_PREQUAL_LINE}
              </p>
              <p className="mt-3 text-sm text-btf-text-muted">
                {LEGAL_NO_GUARANTEE_LINE}
              </p>
            </CardContent>
          </Card>
          <DisclaimerNote />
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-white/40 backdrop-blur-[2px]">
        <div className="mx-auto max-w-3xl space-y-14">
          <section className="space-y-6">
            <SectionHeading title="Introduction" />
            <div className={prose}>
              <p>
                {SITE_NAME} respects your privacy. This policy explains what we may
                collect when you use our website, complete our pre-screen, or contact
                us - and how we use that information to operate the business and
                communicate with you.
              </p>
              <p>
                If you do not agree with this policy, please do not submit information
                through our site. When you submit the pre-screen, you are directing us
                to use your information as described here and in our{" "}
                <Link
                  href="/terms/"
                  className="text-btf-accent-soft underline-offset-4 hover:underline"
                >
                  Terms of Use
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Information we collect" />
            <div className={prose}>
              <h3 className="text-base font-semibold text-btf-text md:text-lg">
                Contact information
              </h3>
              <p>
                If you choose to engage with us, we may collect your name, phone
                number, email address, and similar contact details you provide.
              </p>
              <h3 className="pt-2 text-base font-semibold text-btf-text md:text-lg">
                Business information
              </h3>
              <p>
                We collect the business details you provide in the application -
                your business name, time in business, requested funding amount,
                and intended use of funds.
              </p>
              <h3 className="pt-2 text-base font-semibold text-btf-text md:text-lg">
                Application responses
              </h3>
              <p>
                The pre-screen asks structured questions about time in business,
                funding needs, and intended use of funds. Your answers help us
                understand fit and route conversations appropriately. We may store
                these responses in our systems as described in our internal data
                practices.
              </p>
              <h3 className="pt-2 text-base font-semibold text-btf-text md:text-lg">
                Bank statements
              </h3>
              <p>
                If you choose to upload bank statements (during the pre-screen or
                through a secure link we send you), those files are transmitted over
                encrypted connections and stored in a private, access-controlled
                storage system. Statements are used only to review your application
                and evaluate funding fit. We retain them only as long as needed for
                that purpose and our record-keeping obligations, and you may request
                deletion using the contact details below.
              </p>
              <h3 className="pt-2 text-base font-semibold text-btf-text md:text-lg">
                Website analytics / tracking data
              </h3>
              <p>
                Like most sites, we may use cookies, pixels, or similar technologies to
                measure site performance, understand traffic patterns, and improve the
                experience. In the future, we may enable tools such as Google Analytics
                4, Google Ads conversion tags, or Meta Pixel - only in a way that fits
                our compliance standards and applicable law.
              </p>
              <h3 className="pt-2 text-base font-semibold text-btf-text md:text-lg">
                Communication consent data
              </h3>
              <p>
                We record whether you consent to email and (optionally) SMS, along with
                the disclosure language shown at the time you checked those boxes.
              </p>
            </div>
          </section>
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border">
        <div className="mx-auto max-w-3xl space-y-14">
          <section className="space-y-6">
            <SectionHeading title="How we use information" />
            <div className={prose}>
              <h3 className="text-base font-semibold text-btf-text md:text-lg">
                To review funding fit
              </h3>
              <p>
                We use your responses to evaluate whether a conversation about funding
                options may make sense - based on the standards described on this site.{" "}
                {DISCLAIMER_PREQUAL_LINE}
              </p>
              <h3 className="pt-2 text-base font-semibold text-btf-text md:text-lg">
                To contact applicants
              </h3>
              <p>
                If you request contact or provide contact details, we may call, email,
                or text you about your submission and next steps - consistent with your
                consent and applicable law.
              </p>
              <h3 className="pt-2 text-base font-semibold text-btf-text md:text-lg">
                To improve the website and funnel
              </h3>
              <p>
                We may use aggregated or technical information to fix issues, improve
                clarity, and make the experience easier to complete on mobile and
                desktop.
              </p>
              <h3 className="pt-2 text-base font-semibold text-btf-text md:text-lg">
                To send email or SMS when consent is provided
              </h3>
              <p>
                Email consent is required to submit the pre-screen. SMS is optional. If
                you opt in to SMS, we will use your phone number only for messages
                related to your submission and follow-up, unless you are told
                otherwise with a clear choice.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="SMS consent" />
            <div className={prose}>
              <p>
                SMS consent is optional. If you provide it, you understand that message
                frequency may vary, message and data rates may apply, and you can opt
                out by replying <span className="font-medium text-btf-text">STOP</span>{" "}
                to any message we send (or by following the instructions in that
                message).
              </p>
              <p>
                If you opt out, we will stop marketing or follow-up texts unless
                applicable law allows a narrow exception (for example, a one-time
                transactional message confirming your opt-out).
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Information sharing" />
            <div className={prose}>
              <p>
                We do not sell your personal information. We may share information
                with funding partners, brokers, lenders, or service providers only
                when it is needed to evaluate fit, deliver services you requested, or
                operate our business - subject to contracts and compliance requirements
                appropriate to the relationship.
              </p>
              <p>
                If counsel advises a different formulation for your jurisdiction or
                partner agreements, we will update this section accordingly.
              </p>
            </div>
          </section>
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-white/40 backdrop-blur-[2px]">
        <div className="mx-auto max-w-3xl space-y-14">
          <section className="space-y-6">
            <SectionHeading title="Cookies / analytics" />
            <div className={prose}>
              <p>
                We may use cookies and similar technologies for essential site
                operation, preferences, security, and analytics. If we enable GA4,
                Google Ads, Meta Pixel, or similar tools, we will aim to configure them
                responsibly and in line with platform requirements and applicable law.
              </p>
              <p>
                Your browser may let you block or delete cookies. Blocking cookies can
                affect how certain features work.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Data security" />
            <div className={prose}>
              <p>
                We use reasonable administrative, technical, and organizational
                measures to protect information. No online transmission or storage
                method is perfectly secure. If you believe your information has been
                misused, contact us using the details below.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Contact" />
            <div className={prose}>
              <p>
                Questions about this policy or your information: use our{" "}
                <Link
                  href={ROUTES.contact}
                  className="text-btf-accent-soft underline-offset-4 hover:underline"
                >
                  contact page
                </Link>
                . If email is published on the site, you may also use that address for
                privacy-related requests.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Attorney review note" />
            <div className={prose}>
              <p>
                This Privacy Policy is a working draft. It should be reviewed and
                finalized by qualified legal counsel before paid launch, regulated
                marketing, or any high-volume outbound contact program.
              </p>
            </div>
          </section>
        </div>
      </SectionShell>
    </>
  );
}
