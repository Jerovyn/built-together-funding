"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  configured: boolean;
  connected: boolean;
  email?: string;
};

const STATUS_COPY: Record<string, string> = {
  connected: "Google Calendar connected.",
  denied: "Google access was denied. Try again.",
  bad_state: "Connection expired. Try again.",
  missing_config: "Add Google OAuth keys in Vercel, then redeploy.",
  no_db: "Database unavailable.",
  no_refresh: "Google did not return a refresh token. Disconnect and reconnect with consent.",
  error: "Could not finish connecting. Try again.",
};

export function GoogleConnectPanel({ configured, connected, email }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("google");
  const [busy, setBusy] = useState(false);

  const disconnect = async () => {
    setBusy(true);
    try {
      await fetch("/api/admin/google/disconnect/", { method: "POST" });
      router.replace("/admin/settings/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {status && STATUS_COPY[status] ? (
        <p
          className={`text-sm ${status === "connected" ? "text-emerald-700" : "text-red-600"}`}
          role="status"
        >
          {STATUS_COPY[status]}
        </p>
      ) : null}

      <p className="text-sm text-btf-text-muted">
        When connected, every booked funding review creates a Google Calendar
        event with a Meet link and invites the applicant.
      </p>

      {!configured ? (
        <p className="text-sm text-btf-text-muted">
          Google OAuth is not configured on this deployment yet.
        </p>
      ) : connected ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-btf-text">
            Connected{email ? ` as ${email}` : ""}.
          </p>
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={() => void disconnect()}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <a href="/api/admin/google/connect/">
          <Button type="button" variant="primary">
            Connect Google Calendar
          </Button>
        </a>
      )}
    </div>
  );
}
