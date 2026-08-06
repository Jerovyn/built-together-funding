"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  PRODUCTS,
  getProduct,
  type PaymentFrequency,
  type Product,
  type ProductSlug,
} from "@/lib/products";
import { saveCalcSnapshotToSession } from "@/lib/calculator-preset";
import type { CalcSnapshot } from "@/lib/apply-schema";
import {
  CTA_PREQUAL_LABEL,
  DISCLAIMER_ESTIMATE_LINE,
  ROUTES,
} from "@/lib/constants";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

/* ---------------------------------- math --------------------------------- */

const PAYMENTS_PER_MONTH: Record<PaymentFrequency, number> = {
  daily: 21, // business days
  weekly: 13 / 3,
  monthly: 1,
};

const FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const FREQUENCY_UNIT: Record<PaymentFrequency, string> = {
  daily: "business day",
  weekly: "week",
  monthly: "month",
};

type CostResult = {
  perPayment: number;
  paymentsCount: number;
  monthlyEquivalent: number;
  totalRepayment: number;
  totalCost: number;
  costPerDollar: number;
};

/**
 * Correct per-product pricing math (unlike competitor calculators that apply a
 * factor rate to everything): factor products multiply, loan products amortize.
 */
function computeCost(
  product: Product,
  amount: number,
  termMonths: number,
  rate: number,
  frequency: PaymentFrequency,
): CostResult {
  const paymentsCount = Math.max(
    1,
    Math.round(termMonths * PAYMENTS_PER_MONTH[frequency]),
  );

  if (product.calc.mode === "factor") {
    const totalRepayment = amount * rate;
    return {
      perPayment: totalRepayment / paymentsCount,
      paymentsCount,
      monthlyEquivalent: totalRepayment / termMonths,
      totalRepayment,
      totalCost: totalRepayment - amount,
      costPerDollar: rate,
    };
  }

  // Amortized: rate is an estimated APR (%).
  const periodsPerYear = PAYMENTS_PER_MONTH[frequency] * 12;
  const periodRate = rate / 100 / periodsPerYear;
  const perPayment =
    periodRate === 0
      ? amount / paymentsCount
      : (amount * periodRate) / (1 - Math.pow(1 + periodRate, -paymentsCount));
  const totalRepayment = perPayment * paymentsCount;
  return {
    perPayment,
    paymentsCount,
    monthlyEquivalent: totalRepayment / termMonths,
    totalRepayment,
    totalCost: totalRepayment - amount,
    costPerDollar: amount > 0 ? totalRepayment / amount : 0,
  };
}

/* ------------------------------- formatting ------------------------------ */

function money(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function moneyShort(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m >= 10 ? `$${Math.round(m)}M` : `$${m.toFixed(1)}M`;
  }
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

function parseMoneyInput(value: string): number {
  const n = Number(value.replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function termLabel(months: number): string {
  if (months < 12 || months % 12 !== 0) return `${months} mo`;
  const years = months / 12;
  return years === 1 ? "1 year" : `${years} years`;
}

/* --------------------------------- inputs -------------------------------- */

type SliderRowProps = {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  note?: string;
};

function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  note,
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
        style={{ "--slider-pct": `${pct}%` } as CSSProperties}
        className="btf-slider mt-2 block w-full max-w-full py-3 sm:py-2"
      />
      {note ? (
        <span className="mt-0.5 block text-[11px] leading-snug text-btf-text-muted">
          {note}
        </span>
      ) : null}
    </label>
  );
}

type AmountRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
};

function AmountRow({ label, value, min, max, step, onChange }: AmountRowProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const pct = ((value - min) / (max - min)) * 100;
  const shown = draft ?? (value > 0 ? Math.round(value).toLocaleString("en-US") : "");

  const commit = (raw: string) => {
    const parsed = parseMoneyInput(raw);
    onChange(Math.min(max, Math.max(min, parsed || min)));
    setDraft(null);
  };

  return (
    <div className="min-w-0">
      <label className="block min-w-0">
        <span className="flex items-baseline justify-between gap-2">
          <span className="min-w-0 text-xs font-medium text-btf-text-muted sm:text-sm">
            {label}
          </span>
          <span className="shrink-0 text-[11px] font-medium tabular-nums text-btf-text-muted">
            {moneyShort(min)} – {moneyShort(max)}
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
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
            }}
            className={cn(
              "w-full rounded-lg border border-btf-border bg-btf-bg py-2.5 pl-7 pr-4 text-sm font-semibold tabular-nums text-btf-text",
              "placeholder:text-btf-text-muted focus:border-btf-accent/50 focus:outline-none focus:ring-2 focus:ring-btf-accent/25",
            )}
            aria-label={label}
          />
        </div>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          setDraft(null);
          onChange(Number(e.target.value));
        }}
        style={{ "--slider-pct": `${pct}%` } as CSSProperties}
        className="btf-slider mt-1.5 block w-full max-w-full py-3 sm:py-2"
        aria-label={`${label} slider`}
      />
    </div>
  );
}

/* -------------------------------- component ------------------------------ */

type PerProductState = {
  amount: number;
  termMonths: number;
  rate: number;
  frequency: PaymentFrequency;
};

function defaultsFor(product: Product): PerProductState {
  return {
    amount: product.calc.amountDefault,
    termMonths: product.calc.termDefault,
    rate: product.calc.rateDefault,
    frequency: product.calc.defaultFrequency,
  };
}

type FundingCalculatorProps = {
  className?: string;
  initialProductSlug?: ProductSlug;
  /** Compact paddings for the homepage embed. */
  embedded?: boolean;
};

export function FundingCalculator({
  className,
  initialProductSlug,
  embedded = false,
}: FundingCalculatorProps) {
  const initial = getProduct(initialProductSlug ?? "") ?? PRODUCTS[0];
  const [slug, setSlug] = useState<ProductSlug>(initial.slug);
  const [tab, setTab] = useState<"cost" | "earn">("cost");
  const [state, setState] = useState<Record<string, PerProductState>>({
    [initial.slug]: defaultsFor(initial),
  });
  const [interacted, setInteracted] = useState(false);

  // Earn tab inputs (shared across products — they describe the business).
  const [revenueAdd, setRevenueAdd] = useState(15_000);
  const [margin, setMargin] = useState(40);

  const product = getProduct(slug) ?? PRODUCTS[0];
  const s = state[slug] ?? defaultsFor(product);

  const markInteracted = () => {
    setInteracted((prev) => {
      if (!prev) trackEvent("calc_interacted", { source: slug });
      return true;
    });
  };

  const update = (patch: Partial<PerProductState>) => {
    markInteracted();
    setState((prev) => ({
      ...prev,
      [slug]: { ...(prev[slug] ?? defaultsFor(product)), ...patch },
    }));
  };

  const selectProduct = (nextSlug: ProductSlug) => {
    markInteracted();
    setSlug(nextSlug);
    setState((prev) =>
      prev[nextSlug]
        ? prev
        : { ...prev, [nextSlug]: defaultsFor(getProduct(nextSlug) ?? PRODUCTS[0]) },
    );
    trackEvent("calc_product_change", { source: nextSlug });
  };

  const cost = useMemo(
    () => computeCost(product, s.amount, s.termMonths, s.rate, s.frequency),
    [product, s.amount, s.termMonths, s.rate, s.frequency],
  );

  const earn = useMemo(() => {
    const monthlyProfit = revenueAdd * (margin / 100);
    const netDuringTerm = monthlyProfit - cost.monthlyEquivalent;
    const breakEvenMonths =
      monthlyProfit > 0 ? Math.ceil(cost.totalRepayment / monthlyProfit) : Infinity;
    const chartMonths =
      breakEvenMonths === Infinity
        ? 36
        : Math.min(480, Math.max(24, Math.ceil(breakEvenMonths * 1.2)));
    const scale = Math.max(cost.totalRepayment * 1.2, monthlyProfit * chartMonths);
    const bars = Array.from({ length: Math.min(chartMonths, 96) }, (_, i) => {
      // When chartMonths > 96, each bar represents a bucket of months.
      const bucket = chartMonths / Math.min(chartMonths, 96);
      const m = Math.round((i + 1) * bucket);
      const cumulative = monthlyProfit * m;
      return {
        key: i,
        month: m,
        heightPct: scale > 0 ? Math.min((cumulative / scale) * 100, 100) : 0,
        past: cumulative >= cost.totalRepayment,
      };
    });
    return {
      monthlyProfit,
      netDuringTerm,
      breakEvenMonths,
      chartMonths,
      bars,
      costY:
        scale > 0 ? Math.min((cost.totalRepayment / scale) * 100, 100) : 0,
    };
  }, [revenueAdd, margin, cost]);

  const snapshot: CalcSnapshot = {
    product: product.interestKey,
    amount: Math.round(s.amount),
    termMonths: s.termMonths,
    frequency: s.frequency,
    rateType: product.calc.mode === "factor" ? "factor" : "apr",
    rate: s.rate,
    estPayment: Math.round(cost.perPayment),
    totalRepayment: Math.round(cost.totalRepayment),
  };

  const rateDisplay =
    product.calc.mode === "factor" ? s.rate.toFixed(2) : `${s.rate.toFixed(2).replace(/\.00$/, "")}%`;

  const beLabel =
    earn.breakEvenMonths === Infinity
      ? "—"
      : `${earn.breakEvenMonths.toLocaleString("en-US")} mo`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-btf-border bg-btf-card shadow-btf-card",
        className,
      )}
    >
      {/* Product chips + tab switch */}
      <div className="flex flex-col gap-3 border-b border-btf-border p-4 sm:p-5">
        <div className="relative -mx-1 px-1">
          <div
            className={cn(
              "flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-1",
              "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
            role="tablist"
            aria-label="Financing product"
          >
            {PRODUCTS.map((p) => (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={slug === p.slug}
                onClick={() => selectProduct(p.slug)}
                className={cn(
                  "shrink-0 snap-start rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-150 sm:text-sm",
                  "motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
                  slug === p.slug
                    ? "border-btf-accent bg-btf-accent text-white"
                    : "border-btf-border bg-btf-bg text-btf-text-muted hover:border-btf-accent/40 hover:text-btf-text",
                )}
              >
                {p.shortName}
              </button>
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-btf-card to-transparent md:hidden"
            aria-hidden
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-xs text-btf-text-muted sm:text-sm">
            {product.tagline}
          </p>
          <div className="flex shrink-0 rounded-lg border border-btf-border bg-btf-secondary p-0.5">
            {(
              [
                ["cost", "What it costs"],
                ["earn", "What it earns"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  markInteracted();
                  setTab(key);
                  trackEvent("calc_tab_change", { source: key });
                }}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 motion-safe:active:scale-[0.97] sm:px-3 sm:text-sm",
                  tab === key
                    ? "bg-btf-card text-btf-text shadow-sm"
                    : "text-btf-text-muted hover:text-btf-text",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Inputs */}
        <div
          className={cn(
            "min-w-0 space-y-4 border-b border-btf-border p-4 sm:space-y-5 sm:p-5 lg:border-b-0 lg:border-r",
            !embedded && "md:p-6",
          )}
        >
          <AmountRow
            label={product.calc.amountLabel}
            value={s.amount}
            min={product.calc.amountMin}
            max={product.calc.amountMax}
            step={product.calc.amountStep}
            onChange={(v) => update({ amount: v })}
          />
          <SliderRow
            label="Term length"
            value={s.termMonths}
            display={termLabel(s.termMonths)}
            min={product.calc.termMinMonths}
            max={product.calc.termMaxMonths}
            step={product.calc.termStep}
            onChange={(v) => update({ termMonths: v })}
          />
          <SliderRow
            label={product.calc.mode === "factor" ? "Factor rate" : "Est. APR"}
            value={s.rate}
            display={rateDisplay}
            min={product.calc.rateMin}
            max={product.calc.rateMax}
            step={product.calc.rateStep}
            onChange={(v) => update({ rate: v })}
            note={product.calc.rateNote}
          />
          {product.calc.frequencies.length > 1 ? (
            <div>
              <p className="text-xs font-medium text-btf-text-muted sm:text-sm">
                Payment frequency
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {product.calc.frequencies.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => update({ frequency: f })}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-150 motion-safe:active:scale-[0.97] sm:text-sm",
                      s.frequency === f
                        ? "border-btf-accent bg-btf-accent/10 text-btf-accent"
                        : "border-btf-border bg-btf-bg text-btf-text-muted hover:border-btf-accent/40",
                    )}
                  >
                    {FREQUENCY_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "earn" ? (
            <div className="space-y-4 rounded-xl border border-btf-border bg-btf-secondary p-3.5 sm:space-y-5 sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-btf-text-muted">
                What this money earns you
              </p>
              <SliderRow
                label="Revenue it adds / month"
                value={revenueAdd}
                display={`${money(revenueAdd)}/mo`}
                min={1_000}
                max={200_000}
                step={1_000}
                onChange={(v) => {
                  markInteracted();
                  setRevenueAdd(v);
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
            </div>
          ) : null}
        </div>

        {/* Outputs */}
        <div
          className={cn(
            "flex min-w-0 flex-col p-4 sm:p-5",
            !embedded && "md:p-6",
          )}
        >
          {tab === "cost" ? (
            <>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px]">
                    Est. payment / {FREQUENCY_UNIT[s.frequency]}
                  </p>
                  <p className="mt-0.5 truncate text-lg font-extrabold tabular-nums text-btf-accent sm:mt-1 sm:text-xl md:text-2xl">
                    {money(cost.perPayment)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px]">
                    Total repayment
                  </p>
                  <p className="mt-0.5 truncate text-lg font-extrabold tabular-nums text-btf-text sm:mt-1 sm:text-xl md:text-2xl">
                    {money(cost.totalRepayment)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px]">
                    Cost of capital
                  </p>
                  <p className="mt-0.5 truncate text-lg font-extrabold tabular-nums text-btf-text sm:mt-1 sm:text-xl md:text-2xl">
                    {money(cost.totalCost)}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-btf-border bg-btf-secondary p-3.5 text-sm sm:mt-5 sm:grid-cols-4 sm:p-4">
                <div>
                  <dt className="text-[11px] font-medium text-btf-text-muted">
                    {product.calc.mode === "factor" ? "Factor rate" : "Est. APR"}
                  </dt>
                  <dd className="font-bold tabular-nums text-btf-text">{rateDisplay}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-btf-text-muted">
                    Per $1 borrowed
                  </dt>
                  <dd className="font-bold tabular-nums text-btf-text">
                    ${cost.costPerDollar.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-btf-text-muted">Term</dt>
                  <dd className="font-bold tabular-nums text-btf-text">
                    {termLabel(s.termMonths)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-btf-text-muted">
                    Payments
                  </dt>
                  <dd className="font-bold tabular-nums text-btf-text">
                    {cost.paymentsCount.toLocaleString("en-US")}
                  </dd>
                </div>
              </dl>

              <p className="mt-3 text-xs leading-snug text-btf-text-muted">
                Flip to{" "}
                <button
                  type="button"
                  onClick={() => setTab("earn")}
                  className="font-semibold text-btf-accent hover:underline"
                >
                  What it earns
                </button>{" "}
                to see if the purchase pays for itself.
              </p>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px]">
                    Added profit / mo
                  </p>
                  <p className="mt-0.5 truncate text-lg font-extrabold tabular-nums text-btf-text sm:mt-1 sm:text-xl md:text-2xl">
                    {money(earn.monthlyProfit)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px]">
                    Net / mo during term
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 truncate text-lg font-extrabold tabular-nums sm:mt-1 sm:text-xl md:text-2xl",
                      earn.netDuringTerm >= 0 ? "text-emerald-600" : "text-red-600",
                    )}
                  >
                    {earn.netDuringTerm >= 0 ? "+" : "−"}
                    {money(Math.abs(earn.netDuringTerm))}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-btf-text-muted sm:text-[11px]">
                    Covers all-in cost
                  </p>
                  <p className="mt-0.5 truncate text-lg font-extrabold tabular-nums text-btf-accent sm:mt-1 sm:text-xl md:text-2xl">
                    {beLabel}
                  </p>
                </div>
              </div>

              <div
                className="relative mt-4 min-w-0 flex-1 sm:mt-5"
                role="img"
                aria-label={`Cumulative added profit vs. total repayment of ${money(cost.totalRepayment)}. Break-even around ${beLabel}.`}
              >
                <div className="relative flex h-32 items-end gap-px sm:h-36 sm:gap-[2px] md:h-40">
                  {earn.bars.map((bar) => (
                    <div
                      key={bar.key}
                      className={cn(
                        "min-w-0 flex-1 rounded-t-sm transition-[height,background-color] duration-300",
                        bar.past ? "bg-btf-accent" : "bg-btf-accent/20",
                      )}
                      style={{ height: `${bar.heightPct}%` }}
                    />
                  ))}
                  <div
                    className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-btf-text/40 transition-[bottom] duration-300"
                    style={{ bottom: `${earn.costY}%` }}
                  >
                    <span className="absolute -top-5 right-0 truncate rounded-md bg-btf-secondary px-1.5 py-0.5 text-[10px] font-bold text-btf-text sm:-top-6 sm:px-2 sm:text-[11px]">
                      All-in cost · {moneyShort(cost.totalRepayment)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-medium text-btf-text-muted">
                  <span>Month 1</span>
                  <span>{earn.chartMonths.toLocaleString("en-US")} months</span>
                </div>
              </div>

              <p className="mt-3 text-xs leading-snug text-btf-text-muted">
                &ldquo;Net / mo during term&rdquo; is added profit minus the
                monthly-equivalent payment of {money(cost.monthlyEquivalent)}.
                Break-even includes the full cost of capital — not just the
                purchase price.
              </p>
            </>
          )}

          {interacted ? (
            <div className="mt-5 motion-safe:animate-fade-up">
              <TrackedButtonLink
                href={`${ROUTES.apply}?product=${product.slug}`}
                variant="primary"
                trackLabel={CTA_PREQUAL_LABEL}
                trackLocation="funding_calculator"
                className="w-full justify-center"
                showArrow
                onClick={() => saveCalcSnapshotToSession(snapshot)}
              >
                {CTA_PREQUAL_LABEL} with these numbers
              </TrackedButtonLink>
            </div>
          ) : null}

          <p className="mt-4 text-[11px] leading-snug text-btf-text-muted">
            {DISCLAIMER_ESTIMATE_LINE}
          </p>
        </div>
      </div>
    </div>
  );
}
