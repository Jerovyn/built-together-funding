import type { ReactNode } from "react";

type ApplyStepProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function ApplyStep({ title, description, children }: ApplyStepProps) {
  return (
    <div className="animate-fade-up space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-btf-text sm:text-xl">
        {title}
      </h2>
      {description ? (
        <p className="-mt-2 text-sm leading-snug text-btf-text-muted">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
