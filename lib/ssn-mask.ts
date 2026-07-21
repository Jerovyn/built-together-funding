export function maskSsn(ssn: string | null | undefined): string {
  const digits = (ssn ?? "").replace(/\D/g, "");
  if (digits.length < 4) return "•••-••-••••";
  return `•••-••-${digits.slice(-4)}`;
}
