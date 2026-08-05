import {
  calcSnapshotSchema,
  type CalcSnapshot,
  type USE_OF_FUND_VALUES,
} from "@/lib/apply-schema";
import { getProductByInterestKey } from "@/lib/products";

type UseOfFund = (typeof USE_OF_FUND_VALUES)[number];

/**
 * Calculator → funnel handoff. The funding calculator saves a snapshot of what
 * the visitor modeled; the apply funnel seeds product / amount / use of funds
 * from it and the snapshot rides along to the lead record so the review call
 * starts from their numbers.
 */
export const CALC_SNAPSHOT_STORAGE_KEY = "btf_calc_snapshot_v2";

export function saveCalcSnapshotToSession(snapshot: CalcSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CALC_SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* private mode */
  }
}

export function readCalcSnapshotFromSession(): CalcSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CALC_SNAPSHOT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = calcSnapshotSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function clearCalcSnapshotFromSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CALC_SNAPSHOT_STORAGE_KEY);
  } catch {
    /* private mode */
  }
}

/** Use-of-funds chips to pre-select for a product coming from the calculator. */
export function usesForProductInterest(key: string): UseOfFund[] {
  const product = getProductByInterestKey(key);
  return product ? [...product.useOfFundsSeed] : [];
}
