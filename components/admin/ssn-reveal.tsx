"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { maskSsn } from "@/lib/ssn-mask";

type Props = {
  ssn: string | null;
};

export function SsnReveal({ ssn }: Props) {
  const [revealed, setRevealed] = useState(false);
  if (!ssn) return <span className="text-btf-text-muted">—</span>;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="font-mono text-sm tabular-nums">
        {revealed ? ssn : maskSsn(ssn)}
      </span>
      <Button
        type="button"
        variant="secondary"
        className="h-8 px-2 text-xs"
        onClick={() => setRevealed((v) => !v)}
      >
        {revealed ? "Hide" : "Reveal"}
      </Button>
    </span>
  );
}
