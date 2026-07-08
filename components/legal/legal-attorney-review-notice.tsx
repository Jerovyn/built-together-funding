import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

export function LegalAttorneyReviewNotice() {
  return (
    <Card className="border-amber-400/30 bg-amber-400/[0.07]">
      <CardContent className="space-y-3 p-6 md:p-8">
        <p className="text-sm font-semibold text-amber-100">
          Draft for review - not attorney-approved
        </p>
        <p className="text-sm leading-relaxed text-btf-text-muted">
          This page is a substantive working draft for {SITE_NAME}. It is not legal
          advice and it is not a substitute for counsel licensed in your
          jurisdiction. Before paid advertising, partner integrations, or any
          campaign where compliance risk matters, have qualified legal counsel review
          and finalize these materials.
        </p>
      </CardContent>
    </Card>
  );
}
