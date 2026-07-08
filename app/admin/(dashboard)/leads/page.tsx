import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin — Leads",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string;
  time_in_business: string;
  funding_amount: string;
  statements_status: string;
  lead_status: string;
  lead_score: number;
  created_at: string;
};

export default async function AdminLeadsPage() {
  if (!isSupabaseServiceConfigured()) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-btf-text-muted">
          Supabase is not configured. Add service role env vars to load leads.
        </CardContent>
      </Card>
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-btf-text-muted">
          Could not connect to Supabase.
        </CardContent>
      </Card>
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, business_name, email, phone, time_in_business, funding_amount, statements_status, lead_status, lead_score, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as LeadRow[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-btf-text">Leads</h1>
          <p className="text-sm text-btf-text-muted">
            Full PII lives in Supabase — use service-role tools for SSN review.
          </p>
        </div>
        <p className="text-xs text-btf-text-muted">{rows.length} shown</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">
            Could not load leads. Run{" "}
            <code className="text-btf-accent">docs/supabase-bookings-v4-migration.sql</code> if
            booking columns are missing.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-btf-border bg-btf-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-btf-border text-xs uppercase tracking-wider text-btf-text-muted">
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">TIB</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Statements</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-btf-text-muted">
                    No leads yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-btf-border text-btf-text">
                    <td className="whitespace-nowrap px-4 py-3 text-btf-text-muted">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.business_name}</td>
                    <td className="px-4 py-3 text-xs">
                      <div>{row.email}</div>
                      <div className="text-btf-text-muted">{row.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-btf-text-muted">{row.time_in_business}</td>
                    <td className="px-4 py-3 text-btf-text-muted">{row.funding_amount}</td>
                    <td className="px-4 py-3 text-btf-text-muted">{row.statements_status}</td>
                    <td className="px-4 py-3 tabular-nums">{row.lead_score}</td>
                    <td className="px-4 py-3 font-medium text-btf-accent">{row.lead_status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-btf-text-muted">
        Need statement files? Use upload links from internal notification emails or query{" "}
        <code>upload_token</code> in Supabase.{" "}
        <Link href="/admin/appointments/" className="text-btf-accent hover:underline">
          View scheduled calls →
        </Link>
      </p>
    </div>
  );
}
