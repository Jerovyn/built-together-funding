import { HOME_REQUIREMENT_CARDS } from "@/lib/constants";

type MinimumRequirementsProps = {
  title?: string;
  className?: string;
};

export function MinimumRequirements({
  title = "Are we a match? Check our minimum requirements.",
  className,
}: MinimumRequirementsProps) {
  return (
    <div className={className}>
      <h2 className="mx-auto max-w-xl text-balance text-center text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
        {title}
      </h2>
      <ul className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:gap-4">
        {HOME_REQUIREMENT_CARDS.map((card) => (
          <li
            key={card.value + card.label}
            className="rounded-2xl border border-btf-border bg-white p-5 shadow-btf-card sm:p-6"
          >
            <p className="text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl">
              {card.value}
            </p>
            <p className="mt-1 text-sm font-medium text-btf-text-muted sm:text-base">
              {card.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
