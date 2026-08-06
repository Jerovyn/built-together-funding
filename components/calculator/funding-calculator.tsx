"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
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
};

export function FundingCalculator({
  className,
  initialProductSlug,
}: FundingCalculatorProps) {
  const initial = getProduct(initialProductSlug ?? "") ?? PRODUCTS[0];
  const [slug, setSlug] = useState<ProductSlug>(initial.slug);
  const [tab, setTab] = useState<"cost" | "earn">("cost");
  const [advanced, setAdvanced] = useState(false);
  const [state, setState] = useState<Record<string, PerProductState>>({
    [initial.slug]: defaultsFor(initial),
  });
  const trackedInteract = useRef(false);

  const [revenueAdd, setRevenueAdd] = useState(15_000);
  const [margin, setMargin] = useState(40);

  const product = getProduct(slug) ?? PRODUCTS[0];
  const s = state[slug] ?? defaultsFor(product);

  const markInteracted = () => {
    if (trackedInteract.current) return;
    trackedInteract.current = true;
    trackEvent("calc_interacted", { source: slug });
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
    return { monthlyProfit, netDuringTerm, breakEvenMonths };
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
    product.calc.mode === "factor"
      ? s.rate.toFixed(2)
      : `${s.rate.toFixed(2).replace(/\.00$/, "")}%`;

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
      <div className="space-y-5 p-4 sm:p-6">
        <label className="block min-w-0">
          <span className="text-sm font-medium text-btf-text-muted">Product</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2.5 text-sm font-semibold text-btf-text focus:border-btf-accent/50 focus:outline-none focus:ring-2 focus:ring-btf-accent/25"
            value={slug}
            onChange={(e) => selectProduct(e.target.value as ProductSlug)}
            aria-label="Financing product"
          >
            {PRODUCTS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.shortName} · {p.amountRangeLabel}
              </option>
            ))}
          </select>
        </label>

        <AmountRow
          label="Amount"
          value={s.amount}
          min={product.calc.amountMin}
          max={product.calc.amountMax}
          step={product.calc.amountStep}
          onChange={(v) => update({ amount: v })}
        />
        <SliderRow
          label="Term"
          value={s.termMonths}
          display={termLabel(s.termMonths)}
          min={product.calc.termMinMonths}
          max={product.calc.termMaxMonths}
          step={product.calc.termStep}
          onChange={(v) => update({ termMonths: v })}
        />

        <div className="rounded-xl border border-btf-border bg-btf-secondary p-4">
          <p className="text-xs font-medium text-btf-text-muted">
            Est. payment / {FREQUENCY_UNIT[s.frequency]}
          </p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums tracking-tight text-btf-accent sm:text-4xl">
            {money(cost.perPayment)}
          </p>
          <p className="mt-2 text-sm text-btf-text-muted">
            Total repayment {money(cost.totalRepayment)} · Cost of capital{" "}
            {money(cost.totalCost)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            markInteracted();
            setAdvanced((v) => !v);
          }}
          className="text-sm font-semibold text-btf-accent hover:underline"
        >
          {advanced ? "Hide extras ↑" : "Adjust rate & break-even ↓"}
        </button>

        {advanced ? (
          <div className="space-y-4 border-t border-btf-border pt-4">
            <div className="flex rounded-lg border border-btf-border bg-btf-secondary p-0.5">
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
                    "flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-150 motion-safe:active:scale-[0.97]",
                    tab === key
                      ? "bg-btf-card text-btf-text shadow-sm"
                      : "text-btf-text-muted hover:text-btf-text",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "cost" ? (
              <>
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
                    <p className="text-sm font-medium text-btf-text-muted">
                      Payment frequency
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {product.calc.frequencies.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => update({ frequency: f })}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-150 motion-safe:active:scale-[0.97]",
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
                <p className="text-xs text-btf-text-muted">
                  {product.calc.mode === "factor" ? "Factor" : "APR"} {rateDisplay} · $
                  {cost.costPerDollar.toFixed(2)} per $1 borrowed ·{" "}
                  {cost.paymentsCount.toLocaleString("en-US")} payments
                </p>
              </>
            ) : (
              <>
                <SliderRow
                  label="Revenue this adds / month"
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
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-btf-border bg-btf-secondary p-4">
                  <div>
                    <p className="text-xs text-btf-text-muted">Added profit / mo</p>
                    <p className="text-lg font-bold tabular-nums text-btf-text">
                      {money(earn.monthlyProfit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-btf-text-muted">Covers all-in cost</p>
                    <p className="text-lg font-bold tabular-nums text-btf-accent">
                      {beLabel}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}

        <TrackedButtonLink
          href={`${ROUTES.apply}?product=${product.slug}`}
          variant="primary"
          trackLabel={CTA_PREQUAL_LABEL}
          trackLocation="funding_calculator"
          className="w-full justify-center"
          showArrow
          onClick={() => {
            markInteracted();
            saveCalcSnapshotToSession(snapshot);
          }}
        >
          {CTA_PREQUAL_LABEL}
        </TrackedButtonLink>

        <p className="text-[11px] leading-snug text-btf-text-muted">
          {DISCLAIMER_ESTIMATE_LINE}
        </p>
      </div>
    </div>
  );
}
