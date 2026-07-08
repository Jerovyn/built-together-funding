import { parseDobString, US_STATE_CODES, type ApplyFormValues } from "@/lib/apply-schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_ONLY = /\D/g;

function nineDigits(value: string | undefined): boolean {
  return (value?.replace(DIGITS_ONLY, "").length ?? 0) === 9;
}

function tenDigitPhone(value: string | undefined): boolean {
  let d = value?.replace(DIGITS_ONLY, "") ?? "";
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.length === 10;
}

function zipOk(value: string | undefined): boolean {
  return /^\d{5}(-\d{4})?$/.test(value?.trim() ?? "");
}

function stateOk(value: string | undefined): boolean {
  const v = value?.trim().toUpperCase() ?? "";
  return (US_STATE_CODES as readonly string[]).includes(v);
}

function dobOk(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  return parseDobString(value) !== null;
}

type StepReadyValues = Partial<Omit<ApplyFormValues, "legalEntity">> & {
  legalEntity?: string;
};

/** Whether the current funnel step has enough input to submit for validation. */
export function isApplyStepReady(
  step: number,
  values: StepReadyValues,
): boolean {
  switch (step) {
    case 0:
      return (
        Boolean(values.timeInBusiness) &&
        Boolean(values.fundingAmount) &&
        (values.useOfFunds?.length ?? 0) >= 1
      );
    case 1:
      return (
        (values.statementPaths?.length ?? 0) > 0 ||
        values.statementsSkipped === true
      );
    case 2:
      return (
        (values.firstName?.trim().length ?? 0) >= 1 &&
        (values.lastName?.trim().length ?? 0) >= 1 &&
        EMAIL_RE.test(values.email?.trim() ?? "") &&
        tenDigitPhone(values.phone) &&
        dobOk(values.dob) &&
        (values.homeAddress?.trim().length ?? 0) >= 3 &&
        stateOk(values.homeState) &&
        zipOk(values.homeZip) &&
        nineDigits(values.ssn)
      );
    case 3:
      return (
        (values.businessName?.trim().length ?? 0) >= 2 &&
        nineDigits(values.federalId) &&
        (values.legalEntity?.trim().length ?? 0) >= 1 &&
        (values.businessAddress?.trim().length ?? 0) >= 3 &&
        (values.businessCity?.trim().length ?? 0) >= 2 &&
        stateOk(values.businessState) &&
        zipOk(values.businessZip)
      );
    case 4:
      return values.emailConsent === true;
    default:
      return false;
  }
}
