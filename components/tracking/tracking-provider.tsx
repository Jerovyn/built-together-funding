"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { captureAttributionFromWindow } from "@/lib/utm";

function TrackingCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    captureAttributionFromWindow();
  }, [pathname, searchParams]);

  return null;
}

export function TrackingProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <TrackingCapture />
      </Suspense>
      {children}
    </>
  );
}
