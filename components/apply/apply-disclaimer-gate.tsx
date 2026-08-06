"use client";

import type { ReactNode } from "react";

/**
 * Disclaimer is shown inline on the apply page — no blocking modal.
 * Kept as a passthrough wrapper so existing imports stay stable.
 */
export function ApplyDisclaimerGate({ children }: { children: ReactNode }) {
  return children;
}
