import type { Metadata } from "next";
import { FundingReviewScheduler } from "@/components/booking/funding-review-scheduler";
import { DEV_BOOKING_TOKEN } from "@/lib/booking/dev";
import { SITE_NAME } from "@/lib/constants";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Book your funding review",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <section className="min-h-[60dvh] bg-btf-secondary px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl border border-btf-border bg-btf-card p-6 shadow-btf-card">
        <h1 className="text-xl font-semibold text-btf-text">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-btf-text-muted">{body}</p>
      </div>
    </section>
  );
}

export default async function BookReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (
    process.env.NODE_ENV === "development" &&
    token === DEV_BOOKING_TOKEN
  ) {
    return (
      <section className="min-h-[60dvh] bg-btf-secondary px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-xl space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-btf-accent">
              {SITE_NAME} · local preview
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-btf-text sm:text-3xl">
              Schedule your funding review
            </h1>
          </div>
          <div className="rounded-2xl border border-btf-border bg-btf-card p-5 shadow-btf-card sm:p-6">
            <FundingReviewScheduler bookingToken={token} />
          </div>
        </div>
      </section>
    );
  }

  if (!isSupabaseServiceConfigured()) {
    return (
      <Notice
        title="Scheduling unavailable"
        body="Online booking is not available right now. Reply to our email or call us to schedule your review."
      />
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase || !token || token.length < 8) {
    return (
      <Notice
        title="Invalid link"
        body="Double-check the link from your email. If it still does not work, contact us for a fresh one."
      />
    );
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select("first_name, business_name, lead_status, booking_token")
    .eq("booking_token", token)
    .maybeSingle();

  if (error || !lead) {
    return (
      <Notice
        title="Invalid link"
        body="This scheduling link is not valid. Use the link from your pre-qual confirmation email."
      />
    );
  }

  if (lead.lead_status === "not_fit") {
    return (
      <Notice
        title="Scheduling not available"
        body="This file is not eligible for a funding review call at this time."
      />
    );
  }

  return (
    <section className="min-h-[60dvh] bg-btf-secondary px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-btf-accent">
            {SITE_NAME}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-btf-text sm:text-3xl">
            Schedule your funding review
          </h1>
          <p className="mt-2 text-sm text-btf-text-muted">
            Pick a time that works. We&apos;ll call you — no hold music, no phone tree.
          </p>
        </div>
        <div className="rounded-2xl border border-btf-border bg-btf-card p-5 shadow-btf-card sm:p-6">
          <FundingReviewScheduler
            bookingToken={token}
            firstName={String(lead.first_name ?? "")}
            businessName={String(lead.business_name ?? "")}
          />
        </div>
      </div>
    </section>
  );
}
