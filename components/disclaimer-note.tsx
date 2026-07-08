import type { ReactNode } from "react";
import { DISCLAIMER_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

type DisclaimerNoteProps = {
  className?: string;
  children?: ReactNode;
};

export function DisclaimerNote({ className, children }: DisclaimerNoteProps) {
  return (
    <p
      className={cn(
        "text-sm leading-relaxed text-btf-text-muted max-w-prose",
        className,
      )}
    >
      {children ?? DISCLAIMER_SHORT}
    </p>
  );
}
