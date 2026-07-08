import type { ApplyFormValues } from "@/lib/apply-schema";
import {
  FUNDING_AMOUNT_LABELS,
  formatDobDisplay,
  LEGAL_ENTITY_LABELS,
  TIB_LABELS,
  USE_LABELS,
} from "@/lib/input-formatters";
import { cn } from "@/lib/utils";

type ApplySummaryProps = {
  values: Partial<Omit<ApplyFormValues, "legalEntity">> & { legalEntity?: string };
  uploadedCount: number;
  statementsSkipped: boolean;
  onEditStep: (step: number) => void;
  className?: string;
};

function Row({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-btf-border py-2.5 last:border-0">
      <div className="min-w-0">
        <p className="text-xs font-medium text-btf-text-muted">{label}</p>
        <p className="text-sm font-medium text-btf-text">{value}</p>
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-xs font-semibold text-btf-accent hover:underline"
        >
          Edit
        </button>
      ) : null}
    </div>
  );
}

export function ApplySummary({
  values,
  uploadedCount,
  statementsSkipped,
  onEditStep,
  className,
}: ApplySummaryProps) {
  const name = [values.firstName, values.lastName].filter(Boolean).join(" ").trim();
  const uses = (values.useOfFunds ?? [])
    .map((u) => USE_LABELS[u] ?? u)
    .join(", ");

  const statements =
    uploadedCount > 0
      ? `${uploadedCount} file(s) uploaded`
      : statementsSkipped
        ? "Sending later via secure link"
        : "—";

  return (
    <div
      className={cn(
        "rounded-xl border border-btf-border bg-btf-secondary p-4",
        className,
      )}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-btf-text-muted">
        Your file summary
      </p>
      <Row
        label="Funding fit"
        value={[
          values.timeInBusiness ? TIB_LABELS[values.timeInBusiness] : "",
          values.fundingAmount ? FUNDING_AMOUNT_LABELS[values.fundingAmount] : "",
          uses,
        ]
          .filter(Boolean)
          .join(" · ")}
        onEdit={() => onEditStep(0)}
      />
      <Row label="Statements" value={statements} onEdit={() => onEditStep(1)} />
      <Row
        label="Owner"
        value={[name, values.email, values.phone].filter(Boolean).join(" · ")}
        onEdit={() => onEditStep(2)}
      />
      <Row
        label="Business"
        value={[
          values.businessName,
          values.legalEntity ? LEGAL_ENTITY_LABELS[values.legalEntity] ?? values.legalEntity : "",
        ]
          .filter(Boolean)
          .join(" · ")}
        onEdit={() => onEditStep(3)}
      />
      {values.dob ? (
        <Row label="DOB on file" value={formatDobDisplay(values.dob)} />
      ) : null}
    </div>
  );
}
