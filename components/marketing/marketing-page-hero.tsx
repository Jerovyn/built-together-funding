import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";

type MarketingPageHeroProps = {
  badge?: string;
  title: string;
  description?: string;
};

export function MarketingPageHero({
  badge,
  title,
  description,
}: MarketingPageHeroProps) {
  return (
    <SectionShell className="relative overflow-hidden border-b border-btf-border/70 bg-gradient-to-br from-btf-water via-[#F5FAFE] to-btf-water-mid pb-10 pt-10 md:pb-14 md:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-btf-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-btf-ink-3/[0.06] blur-3xl"
      />
      <div className="relative max-w-2xl space-y-3">
        {badge ? <Badge>{badge}</Badge> : null}
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-btf-text md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-base leading-snug text-btf-text-muted md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </SectionShell>
  );
}
