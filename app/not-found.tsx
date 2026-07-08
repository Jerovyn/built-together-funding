import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SectionShell } from "@/components/section-shell";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <SectionShell className="flex min-h-[60vh] items-center bg-btf-bg">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-btf-accent">
          404
        </p>
        <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-btf-text md:text-5xl">
          Wrong turn. It happens on every job site.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-btf-text-muted md:text-lg">
          The page you&apos;re looking for isn&apos;t here. The work, however,
          is right this way.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={ROUTES.home} variant="primary">
            Back to home
          </ButtonLink>
          <ButtonLink href={ROUTES.apply} variant="secondary">
            Check your fit
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-btf-text-muted">
          Looking for something specific? Try{" "}
          <Link
            href={ROUTES.howItWorks}
            className="font-medium text-btf-accent hover:underline"
          >
            How It Works
          </Link>{" "}
          or{" "}
          <Link
            href={ROUTES.contact}
            className="font-medium text-btf-accent hover:underline"
          >
            Contact
          </Link>
          .
        </p>
      </div>
    </SectionShell>
  );
}
