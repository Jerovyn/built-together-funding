"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  configured: boolean;
  connected: boolean;
  email?: string;
  twilioConfigured?: boolean;
  notifyPhoneCount?: number;
};

const STATUS_COPY: Record<string, string> = {
  connected: "Google Calendar connected.",
  denied: "Google access was denied. Try again.",
  bad_state: "Connection expired. Try again.",
  missing_config: "Add Google OAuth keys in Vercel, then redeploy.",
  no_db: "Database unavailable.",
  no_refresh:
    "Google did not return a refresh token. Disconnect and reconnect with consent.",
  error: "Could not finish connecting. Try again.",
};

export function GoogleConnectPanel({
  configured,
  connected,
  email,
  twilioConfigured = false,
  notifyPhoneCount = 0,
}: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("google");
  const [busy, setBusy] = useState<"disconnect" | "meet" | "sms" | null>(null);
  const [meetResult, setMeetResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [smsResult, setSmsResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const disconnect = async () => {
    setBusy("disconnect");
    setMeetResult(null);
    try {
      await fetch("/api/admin/google/disconnect/", { method: "POST" });
      router.replace("/admin/settings/");
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const testMeet = async () => {
    setBusy("meet");
    setMeetResult(null);
    try {
      const res = await fetch("/api/admin/google/test/", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      setMeetResult({
        ok: Boolean(data.ok),
        message: data.message || (res.ok ? "OK" : "Test failed."),
      });
    } catch {
      setMeetResult({ ok: false, message: "Could not reach test endpoint." });
    } finally {
      setBusy(null);
    }
  };

  const testSms = async () => {
    setBusy("sms");
    setSmsResult(null);
    try {
      const res = await fetch("/api/admin/sms-test/", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      setSmsResult({
        ok: Boolean(data.ok),
        message: data.message || (res.ok ? "OK" : "SMS test failed."),
      });
    } catch {
      setSmsResult({ ok: false, message: "Could not reach SMS test endpoint." });
    } finally {
      setBusy(null);
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
        event with a Meet link and invites the applicant. Use{" "}
        <span className="font-medium text-btf-text">Test Meet</span> to verify
        Calendar API + Meet — Connected alone is not enough.
      </p>

      {!configured ? (
        <p className="text-sm text-btf-text-muted">
          Google OAuth is not configured on this deployment yet.
        </p>
      ) : connected ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-btf-text">
              Connected{email ? ` as ${email}` : ""}.
            </p>
            <Button
              type="button"
              variant="primary"
              disabled={busy !== null}
              onClick={() => void testMeet()}
            >
              {busy === "meet" ? "Testing…" : "Test Meet"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy !== null}
              onClick={() => void disconnect()}
            >
              Disconnect
            </Button>
          </div>
          {meetResult ? (
            <p
              className={`text-sm ${meetResult.ok ? "text-emerald-700" : "text-red-600"}`}
              role="status"
            >
              {meetResult.message}
            </p>
          ) : null}
        </div>
      ) : (
        <a href="/api/admin/google/connect/">
          <Button type="button" variant="primary">
            Connect Google Calendar
          </Button>
        </a>
      )}

      <div className="border-t border-btf-border pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-btf-text">SMS alerts</h3>
        <p className="text-sm text-btf-text-muted">
          Sends a test text to{" "}
          <span className="font-medium text-btf-text">INTERNAL_NOTIFY_PHONE</span>{" "}
          via Twilio. Applicant SMS still requires consent on the apply form.
        </p>
        {!twilioConfigured ? (
          <p className="text-sm text-btf-text-muted">
            Twilio is not configured on this deployment yet.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-btf-text">
                Twilio configured
                {notifyPhoneCount > 0
                  ? ` · ${notifyPhoneCount} notify number(s)`
                  : " · no INTERNAL_NOTIFY_PHONE set"}
                .
              </p>
              <Button
                type="button"
                variant="secondary"
                disabled={busy !== null || notifyPhoneCount < 1}
                onClick={() => void testSms()}
              >
                {busy === "sms" ? "Sending…" : "Test SMS"}
              </Button>
            </div>
            {smsResult ? (
              <p
                className={`text-sm ${smsResult.ok ? "text-emerald-700" : "text-red-600"}`}
                role="status"
              >
                {smsResult.message}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
