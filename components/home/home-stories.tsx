import Image from "next/image";
import { SectionShell } from "@/components/section-shell";
import { hasOperatorStories, OPERATOR_STORIES } from "@/lib/stories";

/** Gated: renders nothing until OPERATOR_STORIES is filled from the field. */
export function HomeStories() {
  if (!hasOperatorStories()) return null;

  return (
    <SectionShell className="border-b border-btf-border py-12 sm:py-14">
      <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
        Operators talking to operators
      </h2>
      <p className="mt-2 max-w-lg text-sm text-btf-text-muted">
        Real conversations from the field — capacity, crews, and what funding
        was for.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OPERATOR_STORIES.map((story) => (
          <li
            key={story.id}
            className="flex flex-col overflow-hidden rounded-xl border border-btf-border bg-btf-card"
          >
            {story.imageSrc ? (
              <div className="relative aspect-[16/10] bg-btf-secondary">
                <Image
                  src={story.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col p-4">
              <p className="text-sm leading-relaxed text-btf-text">
                &ldquo;{story.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold text-btf-text-muted">
                {story.name}
                {story.trade ? ` · ${story.trade}` : ""}
                {story.place ? ` · ${story.place}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
