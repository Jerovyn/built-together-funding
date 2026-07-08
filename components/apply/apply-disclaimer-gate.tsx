"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DISCLAIMER_PREQUAL_LINE,
  LEGAL_NO_GUARANTEE_LINE,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "btf_apply_disclaimer_ack";

type ApplyDisclaimerGateProps = {
  children: React.ReactNode;
};

export function ApplyDisclaimerGate({ children }: ApplyDisclaimerGateProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const titleId = useId();
  const acknowledgeRef = useRef<HTMLButtonElement>(null);

  // The gate renders server-side (no loading placeholder), so the page shows
  // real content even before hydration. Returning visitors skip it here.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setAcknowledged(true);
        return;
      }
    } catch {
      /* private mode */
    }
    acknowledgeRef.current?.focus();
  }, []);

  const onAcknowledge = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    setAcknowledged(true);
  };

  if (!acknowledged) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center bg-btf-text/40 p-4 sm:items-center"
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn(
            "w-full max-w-md rounded-2xl border border-btf-border bg-btf-card p-6 shadow-btf-card",
            "motion-safe:animate-fade-up",
          )}
        >
          <h2
            id={titleId}
            className="text-lg font-semibold tracking-tight text-btf-text"
          >
            Before you continue
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-snug text-btf-text-muted">
            <p>{DISCLAIMER_PREQUAL_LINE}</p>
            <p>{LEGAL_NO_GUARANTEE_LINE}</p>
          </div>
          <Button
            ref={acknowledgeRef}
            type="button"
            variant="primary"
            className="mt-6 w-full"
            onClick={onAcknowledge}
          >
            I understand
          </Button>
        </div>
      </div>
    );
  }

  return children;
}
