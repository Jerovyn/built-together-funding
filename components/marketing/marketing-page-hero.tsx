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
    <SectionShell className="border-b border-btf-border pb-10 pt-10 md:pb-14 md:pt-12">
      <div className="max-w-2xl space-y-3">
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
