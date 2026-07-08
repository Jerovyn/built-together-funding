import type { Metadata } from "next";
import type { ReactNode } from "react";
import { UploadLinkClient } from "@/components/apply/upload-link-client";
import { SITE_NAME } from "@/lib/constants";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Upload your statements",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Shell({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-[70dvh] bg-btf-bg py-14 md:py-20">
      <div className="container max-w-xl">{children}</div>
    </section>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <Shell>
      <div className="rounded-2xl border border-btf-border bg-btf-card p-6 shadow-btf-card md:p-8">
        <h1 className="text-xl font-bold text-btf-text md:text-2xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-btf-text-muted md:text-base">
          {body}
        </p>
      </div>
    </Shell>
  );
}

export default async function UploadTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!isSupabaseServiceConfigured()) {
    return (
      <Notice
        title="Uploads unavailable"
        body="Statement uploads are not available right now. Please reply to our email or text and we will sort it out together."
      />
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase || !token || token.length < 8) {
    return (
      <Notice
        title="This link is not valid"
        body="Double-check the link from your email or text. If it still does not work, contact us and we will send a fresh one."
      />
    );
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select("id, business_name, statement_paths")
    .eq("upload_token", token)
    .maybeSingle();

  if (error || !lead) {
    return (
      <Notice
        title="This link is not valid"
        body="Double-check the link from your email or text. If it still does not work, contact us and we will send a fresh one."
      />
    );
  }

  const received = Array.isArray(lead.statement_paths)
    ? lead.statement_paths.length
    : 0;

  return (
    <Shell>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-btf-accent">
            {SITE_NAME}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
            Upload statements for {lead.business_name as string}
          </h1>
          <p className="text-sm leading-relaxed text-btf-text-muted md:text-base">
            Last 3 months of business bank statements. PDF straight from your
            bank portal works best.
          </p>
        </div>
        <div className="rounded-2xl border border-btf-border bg-btf-card p-5 shadow-btf-card md:p-6">
          <UploadLinkClient token={token} alreadyReceived={received} />
        </div>
      </div>
    </Shell>
  );
}
