import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";
import { formatReviewSlotLabel } from "@/lib/booking/availability";

export const metadata: Metadata = {
  title: "Admin — Calls",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type LeadSummary = {
  business_name: string;
  name: string;
  phone: string;
  email: string;
};

type BookingRow = {
  id: string;
  appointment_date: string;
  start_time: string;
  duration_minutes: number;
  status: string;
  created_at: string;
  leads: LeadSummary | null;
};

function normalizeLead(
  leads: LeadSummary | LeadSummary[] | null | undefined,
): LeadSummary | null {
  if (!leads) return null;
  return Array.isArray(leads) ? (leads[0] ?? null) : leads;
}

function normalizeBookings(data: unknown): BookingRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      appointment_date: String(r.appointment_date ?? ""),
      start_time: String(r.start_time ?? ""),
      duration_minutes: Number(r.duration_minutes ?? 0),
      status: String(r.status ?? ""),
      created_at: String(r.created_at ?? ""),
      leads: normalizeLead(r.leads as LeadSummary | LeadSummary[] | null),
    };
  });
}

export default async function AdminAppointmentsPage() {
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
    .from("bookings")
    .select(
      "id, appointment_date, start_time, duration_minutes, status, created_at, leads ( business_name, name, phone, email )",
    )
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(100);

  const rows = normalizeBookings(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-btf-text">Scheduled review calls</h1>
        <p className="text-sm text-btf-text-muted">
          Funding review appointments booked through the site.
        </p>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">
            Could not load bookings. Run{" "}
            <code className="text-btf-accent">docs/supabase-bookings-v4-migration.sql</code>.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-btf-border bg-btf-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-btf-border text-xs uppercase tracking-wider text-btf-text-muted">
                <th className="px-4 py-3 font-medium">When (ET)</th>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-btf-text-muted">
                    No calls booked yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-btf-border">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-btf-text">
                      {formatReviewSlotLabel(
                        String(row.appointment_date),
                        String(row.start_time).slice(0, 8),
                      )}
                    </td>
                    <td className="px-4 py-3">{row.leads?.business_name ?? "—"}</td>
                    <td className="px-4 py-3">{row.leads?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs">
                      <div>{row.leads?.email}</div>
                      <div className="text-btf-text-muted">{row.leads?.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-btf-accent">{row.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
