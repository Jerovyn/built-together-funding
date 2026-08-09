import { USE_OF_FUND_VALUES } from "@/lib/apply-schema";

export type UseOfFund = (typeof USE_OF_FUND_VALUES)[number];

export type HomePurposeOption = {
  id: string;
  label: string;
  useOfFunds: UseOfFund[];
};

/** OnDeck-style first taps — maps into Stage A useOfFunds. */
export const HOME_PURPOSE_OPTIONS: HomePurposeOption[] = [
  {
    id: "cash_flow",
    label: "Manage cash flow",
    useOfFunds: ["wc_growth"],
  },
  {
    id: "equipment",
    label: "Buy equipment",
    useOfFunds: ["equipment"],
  },
  {
    id: "grow",
    label: "Grow my business",
    useOfFunds: ["trucks", "hiring_crews"],
  },
  {
    id: "expenses",
    label: "Cover business expenses",
    useOfFunds: ["other"],
  },
];

export const HOME_PURPOSE_STORAGE_KEY = "btf_home_use_of_funds";

export function writeHomePurposeSeed(useOfFunds: UseOfFund[]): void {
  try {
    sessionStorage.setItem(
      HOME_PURPOSE_STORAGE_KEY,
      JSON.stringify(useOfFunds),
    );
  } catch {
    /* private mode */
  }
}

export function readHomePurposeSeed(): UseOfFund[] | null {
  try {
    const raw = sessionStorage.getItem(HOME_PURPOSE_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(HOME_PURPOSE_STORAGE_KEY);
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const allowed = new Set<string>(USE_OF_FUND_VALUES);
    const cleaned = parsed.filter(
      (v): v is UseOfFund => typeof v === "string" && allowed.has(v),
    );
    return cleaned.length ? cleaned : null;
  } catch {
    return null;
  }
}
