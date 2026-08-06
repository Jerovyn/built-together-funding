"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Controller, type FieldPath, type Resolver, useForm } from "react-hook-form";
import { AddressSuggestInput } from "@/components/apply/address-suggest-input";
import { ApplyField } from "@/components/apply/apply-field";
import { ApplyLoadingState } from "@/components/apply/apply-loading-state";
import { ApplyOptionCard } from "@/components/apply/apply-option-card";
import { ApplyProgress } from "@/components/apply/apply-progress";
import { ApplyResult } from "@/components/apply/apply-result";
import { ApplyStep } from "@/components/apply/apply-step";
import { ApplySummary } from "@/components/apply/apply-summary";
import { SensitiveInput } from "@/components/apply/sensitive-input";
import { StatementUpload } from "@/components/apply/statement-upload";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  APPLY_STEP_COUNT,
  APPLY_STEP_FIELDS,
  LEGAL_ENTITY_VALUES,
  US_STATE_CODES,
  applyFormSchema,
  FUNDING_AMOUNT_VALUES,
  TIME_IN_BUSINESS_VALUES,
  USE_OF_FUND_VALUES,
  type ApplyApiBody,
  type ApplyFormValues,
  type CalcSnapshot,
} from "@/lib/apply-schema";
import {
  CREDIT_CHECK_SHORT,
  DISCLAIMER_PREQUAL_LINE,
  HOME_TRADES_MARQUEE,
  ROUTES,
} from "@/lib/constants";
import {
  PRODUCT_INTEREST_OPTIONS,
  fundingTierForAmount,
  getProduct,
  type ProductSlug,
} from "@/lib/products";
import {
  resultTierToEventName,
  trackApplyAdsConversion,
  trackEvent,
  type TrackEventProps,
} from "@/lib/tracking";
import {
  getAttributionEventProps,
  getCurrentPagePath,
  getTrackingPayloadForApply,
} from "@/lib/utm";
import type { ApplyResultTier } from "@/types/apply";
import { createUploadSessionId } from "@/lib/statements";
import {
  clearCalcSnapshotFromSession,
  readCalcSnapshotFromSession,
  usesForProductInterest,
} from "@/lib/calculator-preset";
import {
  formatDobInput,
  formatEinInput,
  formatPhoneInput,
  formatSsnInput,
  formatZipInput,
} from "@/lib/input-formatters";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "w-full rounded-lg border border-btf-border bg-btf-bg px-4 py-3 text-sm text-btf-text placeholder:text-btf-text-muted",
  "focus:border-btf-accent/50 focus:outline-none focus:ring-2 focus:ring-btf-accent/25",
);

const TIB_OPTIONS: {
  value: (typeof TIME_IN_BUSINESS_VALUES)[number];
  label: string;
}[] = [
  { value: "under_6mo", label: "Under 6 months" },
  { value: "6_12mo", label: "6-12 months" },
  { value: "12_24mo", label: "1-2 years" },
  { value: "2yr_plus", label: "2+ years" },
];

const AMOUNT_OPTIONS: {
  value: (typeof FUNDING_AMOUNT_VALUES)[number];
  label: string;
}[] = [
  { value: "under_25k", label: "Under $25k" },
  { value: "25k_75k", label: "$25k-$75k" },
  { value: "75k_150k", label: "$75k-$150k" },
  { value: "150k_300k", label: "$150k-$300k" },
  { value: "300k_750k", label: "$300k-$750k" },
  { value: "750k_2m", label: "$750k-$2M" },
  { value: "2m_plus", label: "$2M+" },
];

const USE_OPTIONS: {
  value: (typeof USE_OF_FUND_VALUES)[number];
  label: string;
}[] = [
  { value: "equipment", label: "Equipment" },
  { value: "trucks", label: "Trucks" },
  { value: "hiring_crews", label: "Hiring / crews" },
  { value: "marketing_ads", label: "Marketing that already works" },
  { value: "wc_growth", label: "Working capital for growth" },
  { value: "debt_consolidation", label: "Consolidating debt" },
  { value: "acquisition_expansion", label: "Acquisition / expansion" },
  { value: "property_project", label: "Property / major project" },
  { value: "other", label: "Something else" },
];

const LEGAL_ENTITY_OPTIONS: {
  value: (typeof LEGAL_ENTITY_VALUES)[number];
  label: string;
}[] = [
  { value: "sole_prop", label: "Sole proprietorship" },
  { value: "llc", label: "LLC" },
  { value: "s_corp", label: "S Corporation" },
  { value: "c_corp", label: "C Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const INDUSTRY_OPTIONS = [...HOME_TRADES_MARQUEE, "Other"] as const;

const selectClass = cn(inputClass, "appearance-none");

const SUBMIT_FAIL_MESSAGE =
  "We could not submit your application right now. Please try again or contact us directly.";

type UploadedFile = { path: string; name: string };

function isApplyResultTier(value: unknown): value is ApplyResultTier {
  return (
    value === "prequalified" ||
    value === "needs_review" ||
    value === "not_fit_yet"
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

type ApplyFunnelDraft = Omit<ApplyFormValues, "legalEntity"> & {
  legalEntity: string;
};

const PARTIAL_STORAGE_KEY = "btf_partial_lead_id";

/** Steps whose completion triggers the recoverable partial-lead save. */
const CONTACT_STEP_INDEX = 4;

type ApplyFunnelProps = {
  /** Product page / calculator handoff (?product= slug). */
  initialProductSlug?: string;
};

export function ApplyFunnel({ initialProductSlug }: ApplyFunnelProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultTier, setResultTier] = useState<ApplyResultTier | null>(null);
  const [bookingToken, setBookingToken] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nudge, setNudge] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadSession, setUploadSession] = useState("");
  const [partialLeadId, setPartialLeadId] = useState<string | null>(null);
  const [calcSnapshot, setCalcSnapshot] = useState<CalcSnapshot | null>(null);
  const applyStarted = useRef(false);
  const stepContentRef = useRef<HTMLDivElement>(null);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ApplyFunnelDraft>({
    resolver: zodResolver(applyFormSchema) as Resolver<ApplyFunnelDraft>,
    mode: "onBlur",
    defaultValues: {
      useOfFunds: [],
      industry: "",
      statementPaths: [],
      statementsSkipped: false,
      firstName: "",
      lastName: "",
      dob: "",
      ssn: "",
      phone: "",
      homeAddress: "",
      homeState: undefined,
      homeZip: "",
      businessName: "",
      email: "",
      federalId: "",
      legalEntity: "",
      businessAddress: "",
      businessCity: "",
      businessState: undefined,
      businessZip: "",
      emailConsent: false,
      smsConsent: false,
    },
  });

  useEffect(() => {
    setUploadSession(createUploadSessionId());

    // Seed priority: explicit ?product= link, then calculator snapshot.
    const linkedProduct = getProduct((initialProductSlug ?? "") as ProductSlug);
    const snapshot = readCalcSnapshotFromSession();

    if (linkedProduct) {
      setValue("productInterest", linkedProduct.interestKey, {
        shouldValidate: false,
      });
      setValue("useOfFunds", [...linkedProduct.useOfFundsSeed], {
        shouldValidate: false,
      });
    } else if (snapshot) {
      setValue("productInterest", snapshot.product, { shouldValidate: false });
      const uses = usesForProductInterest(snapshot.product);
      if (uses.length) {
        setValue("useOfFunds", uses, { shouldValidate: false });
      }
    }

    if (snapshot) {
      setCalcSnapshot(snapshot);
      if (!linkedProduct || linkedProduct.interestKey === snapshot.product) {
        setValue("fundingAmount", fundingTierForAmount(snapshot.amount), {
          shouldValidate: false,
        });
      }
    }

    try {
      const stored = sessionStorage.getItem(PARTIAL_STORAGE_KEY);
      if (stored) setPartialLeadId(stored);
    } catch {
      /* private mode */
    }
  }, [setValue, initialProductSlug]);

  useEffect(() => {
    if (resultTier) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [resultTier]);

  useEffect(() => {
    stepContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const formValues = watch();

  useEffect(() => {
    if (applyStarted.current) return;
    applyStarted.current = true;
    try {
      const attr = getAttributionEventProps();
      trackEvent("apply_start", {
        step: 0,
        page_path: getCurrentPagePath(),
        ...attr,
      } as TrackEventProps);
    } catch {
      /* never block funnel */
    }
  }, []);

  const syncFiles = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setValue(
      "statementPaths",
      files.map((f) => f.path),
      { shouldValidate: true },
    );
    if (files.length > 0) {
      setValue("statementsSkipped", false, { shouldValidate: true });
    }
  };

  const savePartialLead = async (values: ApplyFunnelDraft) => {
    try {
      const body = {
        productInterest: values.productInterest,
        timeInBusiness: values.timeInBusiness,
        fundingAmount: values.fundingAmount,
        useOfFunds: values.useOfFunds,
        industry: values.industry,
        statementPaths: values.statementPaths,
        statementsSkipped: values.statementsSkipped,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        emailConsent: values.emailConsent,
        smsConsent: values.smsConsent,
        partialLeadId: partialLeadId ?? undefined,
        calculator: calcSnapshot ?? undefined,
        ...getTrackingPayloadForApply(),
      };
      const res = await fetch("/api/apply/partial/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok?: boolean; partialLeadId?: string };
      if (res.ok && json.ok && json.partialLeadId) {
        setPartialLeadId(json.partialLeadId);
        try {
          sessionStorage.setItem(PARTIAL_STORAGE_KEY, json.partialLeadId);
        } catch {
          /* silent */
        }
        trackEvent("apply_partial_saved", { step: CONTACT_STEP_INDEX });
      }
    } catch {
      /* never block funnel */
    }
  };

  const nextStep = async () => {
    const fields = [...APPLY_STEP_FIELDS[step]] as FieldPath<ApplyFunnelDraft>[];
    const ok = fields.length === 0 ? true : await trigger(fields);
    if (!ok) {
      setNudge((v) => v + 1);
      trackEvent("apply_field_error", { step });
      return;
    }
    try {
      const attr = getAttributionEventProps();
      trackEvent("apply_step_complete", {
        step,
        page_path: getCurrentPagePath(),
        ...attr,
      } as TrackEventProps);
    } catch {
      /* silent */
    }

    if (step === CONTACT_STEP_INDEX) {
      await savePartialLead(formValues);
    }

    setStep((s) => Math.min(s + 1, APPLY_STEP_COUNT - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onValid = async (data: ApplyFunnelDraft) => {
    const parsed = applyFormSchema.parse(data);
    setSubmitError(null);
    setLoading(true);
    try {
      const attr = getAttributionEventProps();
      try {
        trackEvent("apply_step_complete", {
          step: APPLY_STEP_COUNT - 1,
          page_path: getCurrentPagePath(),
          ...attr,
        } as TrackEventProps);
        trackEvent("apply_submit", {
          step: APPLY_STEP_COUNT - 1,
          product_interest: parsed.productInterest,
          time_in_business: parsed.timeInBusiness,
          funding_amount: parsed.fundingAmount,
          use_of_funds: parsed.useOfFunds,
          statements_provided: parsed.statementPaths.length > 0,
          page_path: getCurrentPagePath(),
          ...attr,
        } as TrackEventProps);
      } catch {
        /* silent */
      }

      const body = {
        ...parsed,
        ...getTrackingPayloadForApply(),
        partialLeadId: partialLeadId ?? undefined,
        calculator: calcSnapshot ?? undefined,
      } satisfies ApplyApiBody;

      const res = await fetch("/api/apply/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json: unknown = await res.json().catch(() => null);
      const payload =
        json && typeof json === "object"
          ? (json as {
              ok?: unknown;
              status?: unknown;
              bookingToken?: unknown;
            })
          : null;

      if (res.ok && payload?.ok === true && isApplyResultTier(payload.status)) {
        try {
          trackEvent(resultTierToEventName(payload.status), {
            result_tier: payload.status,
            product_interest: parsed.productInterest,
            time_in_business: parsed.timeInBusiness,
            funding_amount: parsed.fundingAmount,
            use_of_funds: parsed.useOfFunds,
            statements_provided: parsed.statementPaths.length > 0,
            page_path: getCurrentPagePath(),
            ...attr,
          } as TrackEventProps);
          trackApplyAdsConversion(payload.status);
        } catch {
          /* silent */
        }
        if (typeof payload.bookingToken === "string") {
          setBookingToken(payload.bookingToken);
        }
        try {
          sessionStorage.removeItem(PARTIAL_STORAGE_KEY);
        } catch {
          /* silent */
        }
        clearCalcSnapshotFromSession();
        setResultTier(payload.status);
        return;
      }

      setSubmitError(SUBMIT_FAIL_MESSAGE);
    } catch {
      setSubmitError(SUBMIT_FAIL_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = () => {
    setNudge((v) => v + 1);
    trackEvent("apply_field_error", { step });
    stepContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (resultTier) {
    return (
      <ApplyResult
        tier={resultTier}
        statementsSkipped={
          formValues.statementsSkipped && uploadedFiles.length === 0
        }
        bookingToken={bookingToken}
        firstName={formValues.firstName}
        businessName={formValues.businessName}
      />
    );
  }

  if (submitError) {
    return (
      <Card className="border-red-500/30 bg-btf-card/80">
        <CardContent className="space-y-6 p-6 md:p-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
              Submission issue
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-btf-text md:text-2xl">
              {submitError}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-btf-text-muted">
            {DISCLAIMER_PREQUAL_LINE}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="primary" onClick={() => setSubmitError(null)}>
              Try again
            </Button>
            <ButtonLink href={ROUTES.contact} variant="secondary">
              Contact
            </ButtonLink>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="relative flex flex-col pb-28 sm:pb-0"
      noValidate
      aria-busy={loading}
    >
      <div className="pb-3">
        <ApplyProgress currentStep={step} totalSteps={APPLY_STEP_COUNT} />
      </div>

      <div ref={stepContentRef} className="min-h-[16rem] sm:min-h-[18rem]">
        {step === 0 ? (
          <ApplyStep
            title="What type of funding?"
            description='Pick one — or "Not sure yet."'
          >
            <div role="group" aria-label="What type of funding?">
              <Controller
                name="productInterest"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {PRODUCT_INTEREST_OPTIONS.map((opt) => (
                        <ApplyOptionCard
                          key={opt.value}
                          compact
                          label={opt.label}
                          selected={field.value === opt.value}
                          onClick={() => {
                            field.onChange(opt.value);
                            const uses = usesForProductInterest(opt.value);
                            if (uses.length && formValues.useOfFunds.length === 0) {
                              setValue("useOfFunds", uses, {
                                shouldValidate: false,
                              });
                            }
                          }}
                        />
                      ))}
                    </div>
                    {errors.productInterest?.message ? (
                      <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                        {errors.productInterest.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
          </ApplyStep>
        ) : null}

        {step === 1 ? (
          <ApplyStep
            title="How much are you looking for?"
            description="A range is fine — we refine it later."
          >
            <div role="group" aria-label="How much are you looking for?">
              <Controller
                name="fundingAmount"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {AMOUNT_OPTIONS.map((opt) => (
                        <ApplyOptionCard
                          key={opt.value}
                          compact
                          label={opt.label}
                          selected={field.value === opt.value}
                          onClick={() => field.onChange(opt.value)}
                        />
                      ))}
                    </div>
                    {errors.fundingAmount?.message ? (
                      <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                        {errors.fundingAmount.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
          </ApplyStep>
        ) : null}

        {step === 2 ? (
          <ApplyStep
            title="What's the money for?"
            description="Pick all that apply."
          >
            <div role="group" aria-label="What's the money for?">
              <Controller
                name="useOfFunds"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {USE_OPTIONS.map((opt) => {
                        const set = new Set(field.value);
                        const selected = set.has(opt.value);
                        return (
                          <ApplyOptionCard
                            key={opt.value}
                            compact
                            label={opt.label}
                            selected={selected}
                            onClick={() => {
                              if (selected) set.delete(opt.value);
                              else set.add(opt.value);
                              field.onChange([...set] as ApplyFormValues["useOfFunds"]);
                            }}
                          />
                        );
                      })}
                    </div>
                    {errors.useOfFunds?.message ? (
                      <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                        {errors.useOfFunds.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
          </ApplyStep>
        ) : null}

        {step === 3 ? (
          <ApplyStep
            title="How long have you been in business?"
            description="Helps us route your file to the right review."
          >
            <div className="space-y-5">
              <div role="group" aria-label="How long have you been in business?">
                <Controller
                  name="timeInBusiness"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {TIB_OPTIONS.map((opt) => (
                          <ApplyOptionCard
                            key={opt.value}
                            compact
                            label={opt.label}
                            selected={field.value === opt.value}
                            onClick={() => field.onChange(opt.value)}
                          />
                        ))}
                      </div>
                      {errors.timeInBusiness?.message ? (
                        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                          {errors.timeInBusiness.message}
                        </p>
                      ) : null}
                    </>
                  )}
                />
              </div>

              <ApplyField
                label="Industry (optional)"
                htmlFor="industry"
                error={errors.industry?.message}
              >
                <select id="industry" className={selectClass} {...register("industry")}>
                  <option value="">Select if you want</option>
                  {INDUSTRY_OPTIONS.map((trade) => (
                    <option key={trade} value={trade}>
                      {trade}
                    </option>
                  ))}
                </select>
              </ApplyField>
            </div>
          </ApplyStep>
        ) : null}

        {step === 4 ? (
          <ApplyStep
            title="Where do we send your options?"
            description="Your review results and next steps go here. No spam, no reselling your info."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ApplyField
                  label="First name"
                  htmlFor="firstName"
                  required
                  error={errors.firstName?.message}
                >
                  <input
                    id="firstName"
                    autoComplete="given-name"
                    placeholder="First name"
                    className={inputClass}
                    {...register("firstName")}
                  />
                </ApplyField>
                <ApplyField
                  label="Last name"
                  htmlFor="lastName"
                  required
                  error={errors.lastName?.message}
                >
                  <input
                    id="lastName"
                    autoComplete="family-name"
                    placeholder="Last name"
                    className={inputClass}
                    {...register("lastName")}
                  />
                </ApplyField>
              </div>

              <ApplyField
                label="Email address"
                htmlFor="email"
                required
                error={errors.email?.message}
              >
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={inputClass}
                  {...register("email")}
                />
              </ApplyField>

              <ApplyField
                label="Phone"
                htmlFor="phone"
                required
                error={errors.phone?.message}
              >
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(555) 555-5555"
                      className={inputClass}
                      value={field.value}
                      onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
              </ApplyField>

              <div className="rounded-xl border border-btf-border bg-btf-secondary p-4">
                <Controller
                  name="emailConsent"
                  control={control}
                  render={({ field }) => (
                    <label className="flex cursor-pointer gap-3 text-left">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 rounded border-btf-border text-btf-accent focus:ring-btf-accent"
                        checked={field.value === true}
                        onChange={(e) => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                      <span className="text-sm leading-snug text-btf-text-muted">
                        <span className="font-medium text-btf-text">
                          I agree to email (required).
                        </span>{" "}
                        Built Together Funding may email me about this
                        pre-screen and related options.
                      </span>
                    </label>
                  )}
                />
                {errors.emailConsent ? (
                  <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                    {errors.emailConsent.message as string}
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-btf-border bg-btf-secondary p-4">
                <Controller
                  name="smsConsent"
                  control={control}
                  render={({ field }) => (
                    <label className="flex cursor-pointer gap-3 text-left">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 rounded border-btf-border text-btf-accent focus:ring-btf-accent"
                        checked={field.value === true}
                        onChange={(e) => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                      <span className="text-sm leading-snug text-btf-text-muted">
                        <span className="font-medium text-btf-text">
                          Text me updates (optional).
                        </span>{" "}
                        I may get texts about my review, including a secure
                        upload link if I choose to send statements later. Reply
                        STOP to opt out.
                      </span>
                    </label>
                  )}
                />
              </div>
            </div>
          </ApplyStep>
        ) : null}

        {step === 5 ? (
          <ApplyStep
            title="Last 3 months of bank statements"
            description="Your statements show what forms can't - real revenue, real seasonality. It's how we review every file."
          >
            <div className="space-y-4">
              {uploadSession ? (
                <StatementUpload
                  mode="presubmit"
                  session={uploadSession}
                  files={uploadedFiles}
                  onFilesChange={syncFiles}
                  onUnavailable={() =>
                    setValue("statementsSkipped", true, { shouldValidate: true })
                  }
                />
              ) : (
                <p className="text-sm text-btf-text-muted">Preparing secure upload…</p>
              )}

              <Controller
                name="statementsSkipped"
                control={control}
                render={({ field }) => (
                  <ApplyOptionCard
                    label="I'll send them later"
                    description="Finish now — we'll email you a secure upload link (and text you if you opted in)."
                    selected={field.value === true && uploadedFiles.length === 0}
                    disabled={uploadedFiles.length > 0}
                    onClick={() => field.onChange(!field.value)}
                  />
                )}
              />
              {errors.statementsSkipped?.message ? (
                <p className="text-xs font-medium text-red-600" role="alert">
                  {errors.statementsSkipped.message}
                </p>
              ) : null}
            </div>
          </ApplyStep>
        ) : null}

        {step === 6 ? (
          <ApplyStep
            title="About you"
            description="Owner identity for your pre-qualification review. Have your SSN handy — it's encrypted in transit and used only for this review."
          >
            <div className="space-y-4">
              <ApplyField
                label="Date of birth"
                htmlFor="dob"
                required
                hint="MM/DD/YYYY"
                error={errors.dob?.message}
              >
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="dob"
                      inputMode="numeric"
                      autoComplete="bday"
                      placeholder="MM/DD/YYYY"
                      className={inputClass}
                      value={field.value}
                      onChange={(e) => field.onChange(formatDobInput(e.target.value))}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
              </ApplyField>

              <ApplyField
                label="Home address"
                htmlFor="homeAddress"
                required
                hint="Start typing for address suggestions"
                error={errors.homeAddress?.message}
              >
                <Controller
                  name="homeAddress"
                  control={control}
                  render={({ field }) => (
                    <AddressSuggestInput
                      id="homeAddress"
                      className={inputClass}
                      placeholder="Street address"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      aria-invalid={Boolean(errors.homeAddress)}
                      onAddressParsed={(parsed) => {
                        if (parsed.street) {
                          setValue("homeAddress", parsed.street, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                        if (parsed.state && US_STATE_CODES.includes(parsed.state as (typeof US_STATE_CODES)[number])) {
                          setValue("homeState", parsed.state as (typeof US_STATE_CODES)[number], {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                        if (parsed.zip) {
                          setValue("homeZip", parsed.zip, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                  )}
                />
              </ApplyField>

              <div className="grid grid-cols-2 gap-4">
                <ApplyField
                  label="State"
                  htmlFor="homeState"
                  required
                  error={errors.homeState?.message}
                >
                  <select
                    id="homeState"
                    autoComplete="address-level1"
                    className={selectClass}
                    {...register("homeState")}
                  >
                    <option value="" disabled>
                      State
                    </option>
                    {US_STATE_CODES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </ApplyField>
                <ApplyField
                  label="ZIP code"
                  htmlFor="homeZip"
                  required
                  error={errors.homeZip?.message}
                >
                  <Controller
                    name="homeZip"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="homeZip"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="ZIP"
                        className={inputClass}
                        value={field.value}
                        onChange={(e) => field.onChange(formatZipInput(e.target.value))}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    )}
                  />
                </ApplyField>
              </div>

              <div className="rounded-xl border border-btf-border bg-btf-secondary p-4">
                <ApplyField
                  label="Social Security #"
                  htmlFor="ssn"
                  required
                  hint="Encrypted in transit. Used only for identity verification during this review — never sold or shared for marketing."
                  error={errors.ssn?.message}
                >
                  <Controller
                    name="ssn"
                    control={control}
                    render={({ field }) => (
                      <SensitiveInput
                        id="ssn"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="XXX-XX-XXXX"
                        format={formatSsnInput}
                        className={inputClass}
                        aria-invalid={Boolean(errors.ssn)}
                      />
                    )}
                  />
                </ApplyField>
              </div>
            </div>
          </ApplyStep>
        ) : null}

        {step === 7 ? (
          <ApplyStep
            title="Your business"
            description="Company details used for underwriting review."
          >
            <div className="space-y-4">
              <ApplyField
                label="Company name"
                htmlFor="businessName"
                required
                error={errors.businessName?.message}
              >
                <input
                  id="businessName"
                  autoComplete="organization"
                  placeholder="Company name"
                  className={inputClass}
                  {...register("businessName")}
                />
              </ApplyField>

              <ApplyField
                label="Federal ID number (EIN)"
                htmlFor="federalId"
                required
                error={errors.federalId?.message}
              >
                <Controller
                  name="federalId"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="federalId"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="XX-XXXXXXX"
                      className={inputClass}
                      value={field.value}
                      onChange={(e) => field.onChange(formatEinInput(e.target.value))}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
              </ApplyField>

              <ApplyField
                label="Legal entity of company"
                htmlFor="legalEntity"
                required
                error={errors.legalEntity?.message}
              >
                <select
                  id="legalEntity"
                  className={selectClass}
                  {...register("legalEntity")}
                >
                  <option value="" disabled>
                    Please select
                  </option>
                  {LEGAL_ENTITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </ApplyField>

              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-btf-text-muted">
                  Company address
                </p>
                <button
                  type="button"
                  className="text-xs font-semibold text-btf-accent hover:underline"
                  onClick={() => {
                    const home = watch();
                    if (home.homeAddress) {
                      setValue("businessAddress", home.homeAddress, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                    if (home.homeState) {
                      setValue("businessState", home.homeState, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                    if (home.homeZip) {
                      setValue("businessZip", home.homeZip, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                >
                  Same as home address
                </button>
              </div>

              <ApplyField
                label="Company address"
                htmlFor="businessAddress"
                required
                hint="Start typing for address suggestions"
                error={errors.businessAddress?.message}
              >
                <Controller
                  name="businessAddress"
                  control={control}
                  render={({ field }) => (
                    <AddressSuggestInput
                      id="businessAddress"
                      className={inputClass}
                      placeholder="Street address"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      aria-invalid={Boolean(errors.businessAddress)}
                      onAddressParsed={(parsed) => {
                        if (parsed.street) {
                          setValue("businessAddress", parsed.street, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                        if (parsed.city) {
                          setValue("businessCity", parsed.city, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                        if (parsed.state && US_STATE_CODES.includes(parsed.state as (typeof US_STATE_CODES)[number])) {
                          setValue("businessState", parsed.state as (typeof US_STATE_CODES)[number], {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                        if (parsed.zip) {
                          setValue("businessZip", parsed.zip, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                  )}
                />
              </ApplyField>

              <ApplyField
                label="City"
                htmlFor="businessCity"
                required
                error={errors.businessCity?.message}
              >
                <input
                  id="businessCity"
                  autoComplete="address-level2"
                  placeholder="City"
                  className={inputClass}
                  {...register("businessCity")}
                />
              </ApplyField>

              <div className="grid grid-cols-2 gap-4">
                <ApplyField
                  label="State"
                  htmlFor="businessState"
                  required
                  error={errors.businessState?.message}
                >
                  <select
                    id="businessState"
                    className={selectClass}
                    {...register("businessState")}
                  >
                    <option value="" disabled>
                      State
                    </option>
                    {US_STATE_CODES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </ApplyField>
                <ApplyField
                  label="ZIP code"
                  htmlFor="businessZip"
                  required
                  error={errors.businessZip?.message}
                >
                  <Controller
                    name="businessZip"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="businessZip"
                        inputMode="numeric"
                        placeholder="ZIP"
                        className={inputClass}
                        value={field.value}
                        onChange={(e) => field.onChange(formatZipInput(e.target.value))}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    )}
                  />
                </ApplyField>
              </div>
            </div>
          </ApplyStep>
        ) : null}

        {step === 8 ? (
          <ApplyStep
            title="Confirm & submit"
            description={CREDIT_CHECK_SHORT + " — review and submit your file."}
          >
            <div className="space-y-4">
              <ApplySummary
                values={formValues}
                uploadedCount={uploadedFiles.length}
                statementsSkipped={formValues.statementsSkipped}
                onEditStep={setStep}
              />

              <p className="rounded-xl border border-btf-border bg-btf-secondary p-4 text-xs leading-relaxed text-btf-text-muted">
                Built Together Funding is committed to protecting your privacy.
                Personal information you provide is used only for this funding
                application and qualification review. By submitting, you
                confirm the communication preferences you selected on the
                contact step.
              </p>
            </div>
          </ApplyStep>
        ) : null}
      </div>

      <div
        className={cn(
          "z-40 border-t border-btf-border bg-btf-card/95 backdrop-blur-sm",
          "fixed inset-x-0 bottom-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]",
          "sm:static sm:inset-auto sm:rounded-b-xl sm:-mx-4 sm:-mb-4 sm:border-t sm:pb-0",
        )}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-end gap-2 px-3 py-2.5 sm:px-4">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              aria-label="Previous step"
              className="mr-auto h-11 w-11 shrink-0 px-0"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
          ) : null}
          {step < APPLY_STEP_COUNT - 1 ? (
            <Button
              key={nudge}
              type="button"
              variant="primary"
              onClick={nextStep}
              disabled={loading}
              className="shrink-0"
              data-nudge="true"
            >
              Continue
            </Button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={cn(buttonClasses("primary"), "shrink-0", loading && "opacity-70")}
            >
              {loading ? "Submitting…" : "See my options"}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-btf-card/95 backdrop-blur-sm"
          aria-live="polite"
          aria-label="Submitting your application"
        >
          <ApplyLoadingState overlay />
        </div>
      ) : null}
    </form>
  );
}
