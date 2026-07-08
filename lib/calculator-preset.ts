import type { USE_OF_FUND_VALUES } from "@/lib/apply-schema";

export type CalcPresetKey =
  | "equipment"
  | "truck"
  | "crew"
  | "marketing"
  | "inventory";

export const CALC_PRESET_STORAGE_KEY = "btf_calc_use";

type UseOfFund = (typeof USE_OF_FUND_VALUES)[number];

const PRESET_TO_USE: Record<CalcPresetKey, UseOfFund[]> = {
  equipment: ["equipment"],
  truck: ["trucks"],
  crew: ["hiring_crews"],
  marketing: ["marketing_ads"],
  inventory: ["wc_growth"],
};

export function saveCalcPresetToSession(key: CalcPresetKey): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CALC_PRESET_STORAGE_KEY, key);
  } catch {
    /* private mode */
  }
}

export function readCalcPresetFromSession(): CalcPresetKey | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CALC_PRESET_STORAGE_KEY);
    if (raw && raw in PRESET_TO_USE) return raw as CalcPresetKey;
  } catch {
    /* private mode */
  }
  return null;
}

export function fundsForCalcPreset(key: CalcPresetKey): UseOfFund[] {
  return PRESET_TO_USE[key];
}
