/** Input formatters for the apply funnel (mask as the user types). */

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** ###-##-#### progressive mask. */
export function formatSsnInput(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

/** ##-####### progressive mask (EIN). */
export function formatEinInput(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}-${d.slice(2)}`;
}

/** (###) ###-#### progressive mask. Tolerates a leading 1. */
export function formatPhoneInput(value: string): string {
  let d = digitsOnly(value);
  if (d.length > 10 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** MM/DD/YYYY progressive mask. */
export function formatDobInput(value: string): string {
  const d = digitsOnly(value).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** #####-#### progressive mask (ZIP+4 optional). */
export function formatZipInput(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** Masks all but the last four digits, e.g. •••-••-1234. */
export function maskSsn(value: string): string {
  const d = digitsOnly(value);
  return d.length >= 4 ? `•••-••-${d.slice(-4)}` : "•••-••-••••";
}
