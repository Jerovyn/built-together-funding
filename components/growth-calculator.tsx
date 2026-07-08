"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  saveCalcPresetToSession,
  type CalcPresetKey,
} from "@/lib/calculator-preset";
import { CTA_PREQUAL_LABEL, ROUTES } from "@/lib/constants";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const USE_PRESETS: Record<
  CalcPresetKey,
  {
    label: string;
    cost: number;
    revenue: number;
    margin: number;
    costLabel: string;
  }
> = {
  equipment: {
    label: "Equipment",
    cost: 60000,
    revenue: 15000,
    margin: 45,
    costLabel: "What it costs",
  },
  truck: {
    label: "Truck",
    cost: 45000,
    revenue: 12000,
    margin: 40,
    costLabel: "What it costs",
  },
  crew: {
    label: "Crew",
    cost: 30000,
    revenue: 20000,
    margin: 30,
    costLabel: "What it costs",
  },
  marketing: {
    label: "Marketing",
    cost: 15000,
    revenue: 10000,
    margin: 50,
    costLabel: "What it costs",
  },
  inventory: {
    label: "Inventory",
    cost: 40000,
    revenue: 25000,
    margin: 35,
    costLabel: "What it costs",
  },
};

const MIN_CHART_MONTHS = 36;
/** Cap bar count for DOM performance; stats still show true break-even beyond this. */
const MAX_RENDER_MONTHS = 480;
const PRESET_KEYS = Object.keys(USE_PRESETS) as CalcPresetKey[];

function parseMoneyInput(value: string): number {
  const n = Number(value.replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatMoneyInput(value: number): string {
  if (value <= 0) return "";
  return Math.round(value).toLocaleString("en-US");
}

function money(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function moneyShort(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m >= 10 ? `$${Math.round(m)}M` : `$${m.toFixed(1)}M`;
  }
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${Math.round(n)}`;
}

type MoneyInputRowProps = {
  label: string;
  value: number;
  min?: number;
  suffix?: string;
  onChange: (v: number) => void;
};

function MoneyInputRow({
  label,
  value,
  min = 0,
  suffix,
  onChange,
}: MoneyInputRowProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? formatMoneyInput(value);

  const commit = (raw: string) => {
    let next = parseMoneyInput(raw);
    if (min > 0 && next > 0 && next < min) next = min;
    onChange(next);
    setDraft(null);
  };

  return (
    <label className="block min-w-0">
      <span className="flex items-baseline justify-between gap-2 sm:gap-3">
        <span className="min-w-0 text-xs font-medium text-btf-text-muted sm:text-sm">
          {label}
        </span>
        <span className="shrink-0 text-sm font-bold tabular-nums text-btf-text sm:text-base">
          {money(value)}
          {suffix ?? ""}
        </span>
      </span>
      <div className="relative mt-2">
        <span
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-btf-text-muted"
          aria-hidden
        >
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={shown}
          placeholder="0"
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(parseMoneyInput(e.target.value));
          }}
          onBlur={(e) => commit(e.target.value)}
          className={cn(
            "w-full rounded-lg border border-btf-border bg-btf-bg py-3 pl-7 pr-4 text-sm tabular-nums text-btf-text",
            "placeholder:text-btf-text-muted focus:border-btf-accent/50 focus:outline-none focus:ring-2 focus:ring-btf-accent/25",
          )}
        />
      </div>
    </label>
  );
}

type SliderRowProps = {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
};

function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block min-w-0">
      <span className="flex items-baseline justify-between gap-2 sm:gap-3">
        <span className="min-w-0 text-xs font-medium text-btf-text-muted sm:text-sm">
          {label}
        </span>
        <span className="shrink-0 text-sm font-bold tabular-nums text-btf-text sm:text-base">
          {display}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={
          {
            "--slider-pct": `${pct}%`,
          } as CSSProperties
        }
        className="btf-slider mt-2 block w-full max-w-full py-3 sm:mt-3 sm:py-2"
      />
    </label>
  );
}

type GrowthCalculatorProps = {
  className?: string;
  /** Show inline CTA after the user adjusts inputs. */
  showApplyBridge?: boolean;
};

/**
 * Break-even illustration from user inputs only — no rates, payments, or quotes.
 */
export function GrowthCalculator({
  className,
  showApplyBridge = true,
}: GrowthCalculatorProps) {
  const [use, setUse] = useState<CalcPresetKey>("equipment");
  const [cost, setCost] = useState(USE_PRESETS.equipment.cost);
  const [revenue, setRevenue] = useState(USE_PRESETS.equipment.revenue);
  const [margin, setMargin] = useState(USE_PRESETS.equipment.margin);
  const [utilization, setUtilization] = useState(85);
  const [interacted, setInteracted] = useState(false);
  const [bePulse, setBePulse] = useState(false);
  const prevBe = useRef<number | typeof Infinity>(0);

  const markInteracted = () => {
    setInteracted((prev) => {
      if (!prev) trackEvent("calc_interacted", { source: use });
      return true;
    });
  };

  const selectUse = (key: CalcPresetKey) => {
    markInteracted();
    setUse(key);
    setCost(USE_PRESETS[key].cost);
    setRevenue(USE_PRESETS[key].revenue);
    setMargin(USE_PRESETS[key].margin);
    saveCalcPresetToSession(key);
  };

  const { monthlyProfit, breakEvenMonth, yearAfterPayoff, bars, costY, chartMonths } =
    useMemo(() => {
      const effectiveRevenue = revenue * (utilization / 100);
      const profit = effectiveRevenue * (margin / 100);
      const be = profit > 0 ? Math.ceil(cost / profit) : Infinity;
      const chartMonths =
        be === Infinity
          ? MIN_CHART_MONTHS
          : Math.max(MIN_CHART_MONTHS, Math.ceil(be * 1.15));
      const renderMonths = Math.min(chartMonths, MAX_RENDER_MONTHS);
      const maxCumulative = profit * renderMonths;
      const scale = Math.max(cost * 1.25, maxCumulative);

      const barData = Array.from({ length: renderMonths }, (_, i) => {
        const m = i + 1;
        const cumulative = profit * m;
        return {
          month: m,
          heightPct: scale > 0 ? Math.min((cumulative / scale) * 100, 100) : 0,
          past: m >= be,
        };
      });

      return {
        monthlyProfit: profit,
        breakEvenMonth: be,
        yearAfterPayoff: profit * 12,
        bars: barData,
        costY: scale > 0 ? Math.min((cost / scale) * 100, 100) : 0,
        chartMonths,
      };
    }, [cost, revenue, margin, utilization]);

  useEffect(() => {
    if (prevBe.current !== breakEvenMonth) {
      prevBe.current = breakEvenMonth;
      setBePulse(true);
      const t = setTimeout(() => setBePulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [breakEvenMonth]);

  const beLabel =
    breakEvenMonth === Infinity
      ? "—"
      : `${breakEvenMonth.toLocaleString("en-US")} mo`;

  const showBridge =
    showApplyBridge &&
    interacted &&
    breakEvenMonth !== Infinity &&
    breakEvenMonth <= chartMonths;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-btf-border bg-btf-card shadow-btf-card",
        className,
      )}
    >
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="min-w-0 space-y-4 border-b border-btf-border p-4 sm:space-y-5 sm:p-5 md:p-7 lg:border-b-0 lg:border-r">
          <div className="relative -mx-1 px-1">
            <div
              className={cn(
                "flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-1",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              {PRESET_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectUse(key)}
                  className={cn(
                    "shrink-0 snap-start rounded-full border px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 sm:px-4",
                    "motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
                    use === key
                      ? "border-btf-accent bg-btf-accent text-white shadow-btf-glow"
                      : "border-btf-border bg-btf-bg text-btf-text-muted hover:border-btf-accent/40 hover:text-btf-text",
                  )}
                >
                  {USE_PRESETS[key].label}
                </button>
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-btf-card to-transparent md:hidden"
              aria-hidden
            />
          </div>

          <div className="space-y-4 sm:space-y-5">
            <MoneyInputRow
              label={USE_PRESETS[use].costLabel}
              value={cost}
              min={5000}
              onChange={(v) => {
                markInteracted();
                setCost(v);
              }}
            />
            <MoneyInputRow
              label="Revenue it adds / month"
              value={revenue}
              min={1000}
              suffix="/mo"
              onChange={(v) => {
                markInteracted();
                setRevenue(v);
              }}
            />
            <SliderRow
              label="Your margin"
              value={margin}
              display={`${margin}%`}
              min={10}
              max={80}
              step={5}
              onChange={(v) => {
                markInteracted();
                setMargin(v);
              }}
            />
            <SliderRow
              label="How much you'll use it"
              value={utilization}
              display={`${utilization}%`}
              min={50}
              max={100}
              step={5}
              onChange={(v) => {
                markInteracted();
                setUtilization(v);
              }}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-4 sm:p-5 md:p-7">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px] sm:tracking-wider">
                Profit / mo
              </p>
              <p className="mt-0.5 truncate text-lg font-extrabold tabular-nums text-btf-text sm:mt-1 sm:text-xl md:text-2xl">
                {money(monthlyProfit)}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px] sm:tracking-wider">
                Covers cost in
              </p>
              <p
                className={cn(
                  "mt-0.5 truncate text-lg font-extrabold tabular-nums text-btf-accent sm:mt-1 sm:text-xl md:text-2xl transition-transform duration-300",
                  bePulse && "motion-safe:scale-110",
                )}
              >
                {beLabel}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px] sm:tracking-wider">
                After payoff / yr
              </p>
              <p className="mt-0.5 truncate text-lg font-extrabold tabular-nums text-btf-text sm:mt-1 sm:text-xl md:text-2xl">
                {money(yearAfterPayoff)}
              </p>
            </div>
          </div>

          <div
            className="relative mt-4 min-w-0 flex-1 sm:mt-5"
            role="img"
            aria-label={`Cumulative earnings over ${chartMonths} months. Payback around ${beLabel}.`}
          >
            <div className="relative flex h-36 items-end gap-px sm:h-40 sm:gap-[2px] md:h-48">
              {bars.map((bar) => (
                <div
                  key={bar.month}
                  className={cn(
                    "min-w-0 flex-1 rounded-t-sm transition-[height,background-color] duration-300",
                    bar.past ? "bg-btf-accent" : "bg-btf-accent/20",
                  )}
                  style={{ height: `${bar.heightPct}%` }}
                />
              ))}
              <div
                className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-btf-text/40 transition-[bottom] duration-300"
                style={{ bottom: `${costY}%` }}
              >
                <span className="absolute -top-5 left-0 max-w-[calc(100%-0.5rem)] truncate rounded-md bg-btf-secondary px-1.5 py-0.5 text-[10px] font-bold text-btf-text sm:-top-6 sm:left-auto sm:right-0 sm:max-w-none sm:px-2 sm:text-[11px]">
                  Cost · {moneyShort(cost)}
                </span>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-btf-text-muted">
              <span>Month 1</span>
              <span>
                {chartMonths > MAX_RENDER_MONTHS
                  ? `${MAX_RENDER_MONTHS.toLocaleString("en-US")}+ months`
                  : `${chartMonths.toLocaleString("en-US")} months`}
              </span>
            </div>
          </div>

          {showBridge ? (
            <div className="mt-5 motion-safe:animate-fade-up">
              <TrackedButtonLink
                href={ROUTES.apply}
                variant="primary"
                trackLabel={CTA_PREQUAL_LABEL}
                trackLocation="calculator_bridge"
                className="w-full justify-center"
                showArrow
                onClick={() => saveCalcPresetToSession(use)}
              >
                {CTA_PREQUAL_LABEL}
              </TrackedButtonLink>
            </div>
          ) : null}

          <p className="mt-4 text-[11px] leading-snug text-btf-text-muted">
            Not a quote. Financing costs not included.
          </p>
        </div>
      </div>
    </div>
  );
}
