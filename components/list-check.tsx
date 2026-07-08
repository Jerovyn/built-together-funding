import type { ReactNode } from "react";

export function ListCheck({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-btf-text-muted md:text-base">
      <span
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-btf-accent"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}
