import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-3xl space-y-4", className)}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <Tag className="text-balance text-2xl font-semibold tracking-tight text-btf-text md:text-3xl">
        {title}
      </Tag>
      {description ? (
        <p className="text-base leading-relaxed text-btf-text-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
