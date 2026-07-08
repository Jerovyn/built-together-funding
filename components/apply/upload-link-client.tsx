"use client";

import { useState } from "react";
import { StatementUpload } from "@/components/apply/statement-upload";

type UploadedFile = { path: string; name: string };

export function UploadLinkClient({
  token,
  alreadyReceived,
}: {
  token: string;
  /** Files already on record for this lead (count only; names not shown). */
  alreadyReceived: number;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  return (
    <div className="space-y-4">
      {alreadyReceived > 0 ? (
        <p className="rounded-xl border border-btf-accent/25 bg-btf-accent/5 p-4 text-sm text-btf-text">
          We already have {alreadyReceived} file
          {alreadyReceived === 1 ? "" : "s"} from you. Add more below if
          needed.
        </p>
      ) : null}

      <StatementUpload
        mode="token"
        token={token}
        files={files}
        onFilesChange={setFiles}
      />

      {files.length > 0 ? (
        <p className="rounded-xl border border-btf-accent/30 bg-btf-accent/10 p-4 text-sm font-semibold text-btf-text">
          Got it - {files.length} file{files.length === 1 ? "" : "s"} received.
          We&apos;ll take it from here and reach out about next steps.
        </p>
      ) : null}
    </div>
  );
}
