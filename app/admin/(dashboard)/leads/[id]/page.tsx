import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadStatementsPanel } from "@/components/admin/lead-statements-panel";
import { SsnReveal } from "@/components/admin/ssn-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  fetchLeadById,
  formatUseOfFunds,
} from "@/lib/admin-leads";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin — Lead",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-btf-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-btf-text">{children}</dd>
    </div>
  );
}

export default async function AdminLeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!isSupabaseServiceConfigured()) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-btf-text-muted">
          Supabase is not configured.
        </CardContent>
      </Card>
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase) notFound();

  const lead = await fetchLeadById(supabase, id);
  if (!lead) notFound();

  const owner =
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    lead.name ||
    "—";
  const paths = lead.statement_paths ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/leads/"
            className="text-xs font-semibold text-btf-accent hover:underline"
          >
            ← Leads
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-btf-text">
            {lead.business_name || "Lead"}
          </h1>
          <p className="text-sm text-btf-text-muted">
            {owner} · {new Date(lead.created_at).toLocaleString()}
          </p>
        </div>
        <a href={`/api/admin/leads/${lead.id}/package/`}>
          <Button type="button" variant="primary">
            Download package (ZIP)
          </Button>
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-btf-text">Owner</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">{owner}</Field>
              <Field label="Email">{lead.email ?? "—"}</Field>
              <Field label="Phone">{lead.phone ?? "—"}</Field>
              <Field label="DOB">{lead.dob ?? "—"}</Field>
              <Field label="SSN">
                <SsnReveal ssn={lead.ssn} />
              </Field>
              <Field label="Home">
                {[lead.home_address, lead.home_state, lead.home_zip]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </Field>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-btf-text">Business</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label="Legal name">{lead.business_name ?? "—"}</Field>
              <Field label="Entity">{lead.legal_entity ?? "—"}</Field>
              <Field label="EIN / Federal ID">{lead.federal_id ?? "—"}</Field>
              <Field label="Time in business">
                {lead.time_in_business ?? "—"}
              </Field>
              <Field label="Address">
                {[
                  lead.business_address,
                  lead.business_city,
                  lead.business_state,
                  lead.business_zip,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </Field>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-btf-text">Funding & pre-screen</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label="Amount">{lead.funding_amount ?? "—"}</Field>
              <Field label="Use of funds">
                {formatUseOfFunds(lead.use_of_funds)}
              </Field>
              <Field label="Score">{lead.lead_score ?? "—"}</Field>
              <Field label="Status">
                <span className="font-medium text-btf-accent">
                  {lead.lead_status ?? "—"}
                </span>
              </Field>
              <Field label="Statements">{lead.statements_status ?? "—"}</Field>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-btf-text">Bank statements</h2>
            <LeadStatementsPanel leadId={lead.id} paths={paths} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
