"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/leads/", label: "Leads" },
  { href: "/admin/appointments/", label: "Calls" },
  { href: "/admin/content/", label: "Content" },
  { href: "/admin/settings/", label: "Settings" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-btf-secondary">
      <header className="border-b border-btf-border bg-btf-card">
        <div className="container flex max-w-6xl items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin/leads/" className="text-sm font-bold text-btf-text">
              BTF Admin
            </Link>
            <nav className="flex gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname?.startsWith(item.href)
                      ? "bg-btf-accent/10 text-btf-accent"
                      : "text-btf-text-muted hover:bg-btf-secondary hover:text-btf-text",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action="/api/admin/logout/" method="post">
            <button
              type="submit"
              className="text-sm font-medium text-btf-text-muted hover:text-btf-text"
              onClick={async (e) => {
                e.preventDefault();
                await fetch("/api/admin/logout/", { method: "POST" });
                window.location.href = "/admin/login/";
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="container max-w-6xl py-6 sm:py-8">{children}</main>
    </div>
  );
}
