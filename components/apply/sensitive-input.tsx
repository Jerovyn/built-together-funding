"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SensitiveInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
  format: (value: string) => string;
  className?: string;
  "aria-invalid"?: boolean;
};

export function SensitiveInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete = "off",
  inputMode = "numeric",
  format,
  className,
  "aria-invalid": ariaInvalid,
}: SensitiveInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        aria-invalid={ariaInvalid}
        onChange={(e) => onChange(format(e.target.value))}
        onBlur={onBlur}
        className={cn("pr-11", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-xs font-semibold text-btf-accent hover:text-btf-accent-mid"
        aria-label={visible ? "Hide value" : "Show value"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
