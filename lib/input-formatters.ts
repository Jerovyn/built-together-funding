/** Shared input formatters for the apply funnel. */

const DIGITS = /\D/g;

export function digitsOnly(value: string): string {
  return value.replace(DIGITS, "");
}

export function formatPhoneInput(value: string): string {
  let d = digitsOnly(value);
  if (d.length > 11) d = d.slice(0, 11);
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

export function formatSsnInput(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

export function formatEinInput(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}-${d.slice(2)}`;
}

export function formatDobInput(value: string): string {
  const d = digitsOnly(value).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function formatZipInput(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** Format ISO or stored DOB for display in summary (MM/DD/YYYY). */
export function formatDobDisplay(value: string): string {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (iso) return `${iso[2]}/${iso[3]}/${iso[1]}`;
  return value;
}

export const FUNDING_AMOUNT_LABELS: Record<string, string> = {
  under_25k: "Under $25k",
  "25k_75k": "$25k–$75k",
  "75k_150k": "$75k–$150k",
  "150k_300k": "$150k–$300k",
  "300k_plus": "$300k+",
};

export const TIB_LABELS: Record<string, string> = {
  under_6mo: "Under 6 months",
  "6_12mo": "6–12 months",
  "12_24mo": "1–2 years",
  "2yr_plus": "2+ years",
};

export const USE_LABELS: Record<string, string> = {
  equipment: "Equipment",
  trucks: "Trucks",
  hiring_crews: "Hiring / crews",
  marketing_ads: "Marketing",
  wc_growth: "Working capital",
  other: "Other",
};

export const LEGAL_ENTITY_LABELS: Record<string, string> = {
  sole_prop: "Sole proprietorship",
  llc: "LLC",
  s_corp: "S Corporation",
  c_corp: "C Corporation",
  partnership: "Partnership",
  other: "Other",
};
