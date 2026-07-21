import { STATEMENTS_BUCKET } from "@/lib/statements";
import { maskSsn } from "@/lib/ssn-mask";
import type { SupabaseClient } from "@supabase/supabase-js";

export { maskSsn };

export type LeadPackageRow = {
  id: string;
  created_at: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  dob: string | null;
  ssn: string | null;
  home_address: string | null;
  home_state: string | null;
  home_zip: string | null;
  federal_id: string | null;
  legal_entity: string | null;
  business_address: string | null;
  business_city: string | null;
  business_state: string | null;
  business_zip: string | null;
  time_in_business: string | null;
  funding_amount: string | null;
  use_of_funds: string[] | null;
  statements_status: string | null;
  statement_paths: string[] | null;
  lead_score: number | null;
  lead_status: string | null;
  sms_consent: boolean | null;
  email_consent: boolean | null;
  source: string | null;
  landing_page: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
};

const LEAD_SELECT =
  "id, created_at, name, first_name, last_name, business_name, email, phone, dob, ssn, home_address, home_state, home_zip, federal_id, legal_entity, business_address, business_city, business_state, business_zip, time_in_business, funding_amount, use_of_funds, statements_status, statement_paths, lead_score, lead_status, sms_consent, email_consent, source, landing_page, utm_source, utm_campaign";

export async function fetchLeadById(
  supabase: SupabaseClient,
  id: string,
): Promise<LeadPackageRow | null> {
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as LeadPackageRow;
}

export function formatUseOfFunds(values: string[] | null | undefined): string {
  if (!values?.length) return "—";
  return values.map((v) => v.replaceAll("_", " ")).join(", ");
}

export function buildApplicationText(
  lead: LeadPackageRow,
  options?: { revealSsn?: boolean },
): string {
  const reveal = options?.revealSsn === true;
  const owner =
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    lead.name ||
    "—";
  const home = [lead.home_address, lead.home_state, lead.home_zip]
    .filter(Boolean)
    .join(", ");
  const bizAddr = [
    lead.business_address,
    lead.business_city,
    lead.business_state,
    lead.business_zip,
  ]
    .filter(Boolean)
    .join(", ");

  const lines = [
    "Built Together Funding — Application package",
    `Generated: ${new Date().toISOString()}`,
    "",
    "=== OWNER ===",
    `Name: ${owner}`,
    `Email: ${lead.email ?? "—"}`,
    `Phone: ${lead.phone ?? "—"}`,
    `DOB: ${lead.dob ?? "—"}`,
    `SSN: ${reveal ? (lead.ssn ?? "—") : maskSsn(lead.ssn)}`,
    `Home: ${home || "—"}`,
    "",
    "=== BUSINESS ===",
    `Business name: ${lead.business_name ?? "—"}`,
    `Legal entity: ${lead.legal_entity ?? "—"}`,
    `Federal ID / EIN: ${lead.federal_id ?? "—"}`,
    `Business address: ${bizAddr || "—"}`,
    `Time in business: ${lead.time_in_business ?? "—"}`,
    "",
    "=== FUNDING ===",
    `Amount: ${lead.funding_amount ?? "—"}`,
    `Use of funds: ${formatUseOfFunds(lead.use_of_funds)}`,
    "",
    "=== PRE-SCREEN ===",
    `Lead score: ${lead.lead_score ?? "—"}`,
    `Lead status: ${lead.lead_status ?? "—"}`,
    `Statements status: ${lead.statements_status ?? "—"}`,
    `Statement files: ${(lead.statement_paths ?? []).length}`,
    `Email consent: ${lead.email_consent ? "yes" : "no"}`,
    `SMS consent: ${lead.sms_consent ? "yes" : "no"}`,
    `Submitted: ${lead.created_at}`,
    "",
    "=== ATTRIBUTION ===",
    `Source: ${lead.source ?? "—"}`,
    `Landing: ${lead.landing_page ?? "—"}`,
    `UTM source: ${lead.utm_source ?? "—"}`,
    `UTM campaign: ${lead.utm_campaign ?? "—"}`,
    "",
    "This package is for underwriting review only. Pre-screen score is not a funding approval.",
  ];
  return lines.join("\n");
}

export function safePackageBaseName(lead: LeadPackageRow): string {
  const raw = (lead.business_name || lead.name || "lead")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const day = new Date(lead.created_at).toISOString().slice(0, 10);
  return `BTF-${raw || "lead"}-${day}`;
}

export async function createStatementSignedUrl(
  supabase: SupabaseClient,
  path: string,
  expiresSec = 120,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(STATEMENTS_BUCKET)
    .createSignedUrl(path, expiresSec);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function downloadStatementBytes(
  supabase: SupabaseClient,
  path: string,
): Promise<{ bytes: Uint8Array; fileName: string } | null> {
  const { data, error } = await supabase.storage
    .from(STATEMENTS_BUCKET)
    .download(path);
  if (error || !data) return null;
  const buf = new Uint8Array(await data.arrayBuffer());
  const fileName = path.split("/").pop() || "statement.bin";
  return { bytes: buf, fileName };
}
