import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SectionShellProps = ComponentProps<"section"> & {
  contained?: boolean;
};

export function SectionShell({
  className,
  contained = true,
  children,
  ...props
}: SectionShellProps) {
  return (
    <section className={cn("py-16 md:py-20", className)} {...props}>
      {contained ? (
        <div className="container max-w-6xl min-w-0">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
