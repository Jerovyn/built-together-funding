import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-btf-secondary px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold text-btf-text">
              Built Together Funding
            </h1>
            <p className="text-sm text-btf-text-muted">Sign in</p>
          </div>
          <Suspense
            fallback={
              <p className="text-center text-sm text-btf-text-muted">Loading…</p>
            }
          >
            <AdminLoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
