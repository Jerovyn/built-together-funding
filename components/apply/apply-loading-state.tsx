"use client";

import { useEffect, useState } from "react";
import { BoltMascotInteractive } from "@/components/mascot/bolt-interactive";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Sending your answers…",
  "Checking fit…",
  "Almost there…",
] as const;

export function ApplyLoadingState({ overlay = false }: { overlay?: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setI((n) => (n + 1) % MESSAGES.length);
    }, 900);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 text-center",
        overlay
          ? "gap-4 py-8"
          : "min-h-[420px] gap-10 py-12",
      )}
    >
      <div className="relative">
        <div
          className="absolute inset-0 -z-10 scale-150 rounded-full bg-btf-accent/15 blur-2xl animate-glow-soft"
          aria-hidden
        />
        <BoltMascotInteractive className={cn("motion-safe:animate-pulse", overlay && "scale-90")} />
      </div>
      <p
        className={cn(
          "max-w-md font-medium leading-snug text-btf-text-muted animate-fade-up",
          overlay ? "text-sm" : "text-sm md:text-base",
        )}
      >
        {MESSAGES[i]}
      </p>
    </div>
  );
}
