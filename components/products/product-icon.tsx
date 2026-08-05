import type { ProductSlug } from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductIconProps = {
  slug: ProductSlug;
  className?: string;
};

const PATHS: Record<ProductSlug, React.ReactNode> = {
  "working-capital": (
    <>
      <path d="M12 2v20" />
      <path d="M17 5.5H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6.5" />
    </>
  ),
  "term-loans": (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 2v4M16 2v4" />
      <path d="M8 14h4M8 17.5h7" />
    </>
  ),
  "line-of-credit": (
    <>
      <rect x="2.5" y="6" width="19" height="12.5" rx="2.5" />
      <path d="M2.5 10.5h19" />
      <path d="M6.5 15h4" />
    </>
  ),
  "equipment-financing": (
    <>
      <circle cx="7" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <path d="M9.5 17.5h5.5" />
      <path d="M4.5 17.5H3v-5l2.5-6H12l2 6h5.5a1.5 1.5 0 0 1 1.5 1.5v3.5h-1" />
      <path d="M7 6.5v6H3" />
    </>
  ),
  "sba-loans": (
    <>
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 18h18v2.5H3z" />
    </>
  ),
  "mca-consolidation": (
    <>
      <path d="M6 4v5a3 3 0 0 0 3 3h9" />
      <path d="M6 20v-4" />
      <path d="M12 4v3a2 2 0 0 0 2 2h4" />
      <path d="M15 9l3 3-3 3" />
    </>
  ),
  acquisitions: (
    <>
      <path d="M11 11l-7.5 7.5a2.1 2.1 0 0 0 3 3L14 14" />
      <path d="M13 7l4 4 4.5-4.5a3.5 3.5 0 0 0-5-5L13 5v2z" />
      <path d="M9 9L5.5 5.5" />
    </>
  ),
  "commercial-real-estate": (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8l6-4v17" />
      <path d="M11 21V11l8 3v7" />
      <path d="M7.5 9.5v.01M7.5 13v.01M7.5 16.5v.01" />
    </>
  ),
};

export function ProductIcon({ slug, className }: ProductIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      aria-hidden
    >
      {PATHS[slug]}
    </svg>
  );
}
