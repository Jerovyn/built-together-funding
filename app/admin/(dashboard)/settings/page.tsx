import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleConnectPanel } from "@/components/admin/google-connect-panel";
import { Card, CardContent } from "@/components/ui/card";
import { getGoogleConnectionStatus } from "@/lib/google-calendar";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin — Settings",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let configured = false;
  let connected = false;
  let email: string | undefined;

  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceRoleClient();
    if (supabase) {
      const status = await getGoogleConnectionStatus(supabase);
      configured = status.configured;
      connected = status.connected;
      email = status.email;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-btf-text">Settings</h1>
        <p className="text-sm text-btf-text-muted">
          Integrations for booking and operations.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-sm font-semibold text-btf-text">
            Google Calendar & Meet
          </h2>
          <Suspense fallback={<p className="text-sm text-btf-text-muted">Loading…</p>}>
            <GoogleConnectPanel
              configured={configured}
              connected={connected}
              email={email}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
