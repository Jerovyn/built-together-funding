"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isoSignupSchema, type IsoSignupValues } from "@/lib/iso-schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-300">{message}</p>;
}

export function IsoSignupForm({ className }: { className?: string }) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const form = useForm<IsoSignupValues>({
    resolver: zodResolver(isoSignupSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      website: "",
      monthlyVolume: "",
      message: "",
    },
  });

  async function onSubmit(values: IsoSignupValues) {
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/iso/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setState({
          status: "error",
          message: data.message || "Unable to submit. Please try again.",
        });
        return;
      }
      setState({
        status: "success",
        message: data.message || "Thanks - we will reach out soon.",
      });
      form.reset();
    } catch {
      setState({ status: "error", message: "Unable to submit. Please try again." });
    }
  }

  const disabled = state.status === "submitting";

  return (
    <Card className={cn("bg-btf-card", className)}>
      <CardContent className="p-6 md:p-8">
        {state.status === "success" ? (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-btf-text">Submitted.</p>
            <p className="text-base leading-relaxed text-btf-text-muted">
              {state.message}
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setState({ status: "idle" })}
            >
              Submit another
            </Button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-btf-text">Your name</label>
                <input
                  className="mt-2 w-full rounded-lg border border-btf-border bg-btf-bg/50 px-3 py-3 text-base text-btf-text placeholder:text-btf-text-muted focus:outline-none focus:ring-2 focus:ring-btf-accent/70"
                  autoComplete="name"
                  {...form.register("name")}
                />
                <FieldError message={form.formState.errors.name?.message} />
              </div>
              <div>
                <label className="text-sm font-medium text-btf-text">Company</label>
                <input
                  className="mt-2 w-full rounded-lg border border-btf-border bg-btf-bg/50 px-3 py-3 text-base text-btf-text placeholder:text-btf-text-muted focus:outline-none focus:ring-2 focus:ring-btf-accent/70"
                  autoComplete="organization"
                  {...form.register("company")}
                />
                <FieldError message={form.formState.errors.company?.message} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-btf-text">Email</label>
                <input
                  className="mt-2 w-full rounded-lg border border-btf-border bg-btf-bg/50 px-3 py-3 text-base text-btf-text placeholder:text-btf-text-muted focus:outline-none focus:ring-2 focus:ring-btf-accent/70"
                  type="email"
                  autoComplete="email"
                  {...form.register("email")}
                />
                <FieldError message={form.formState.errors.email?.message} />
              </div>
              <div>
                <label className="text-sm font-medium text-btf-text">Phone</label>
                <input
                  className="mt-2 w-full rounded-lg border border-btf-border bg-btf-bg/50 px-3 py-3 text-base text-btf-text placeholder:text-btf-text-muted focus:outline-none focus:ring-2 focus:ring-btf-accent/70"
                  type="tel"
                  autoComplete="tel"
                  {...form.register("phone")}
                />
                <FieldError message={form.formState.errors.phone?.message} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-btf-text">
                  Website (optional)
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-btf-border bg-btf-bg/50 px-3 py-3 text-base text-btf-text placeholder:text-btf-text-muted focus:outline-none focus:ring-2 focus:ring-btf-accent/70"
                  placeholder="https://"
                  autoComplete="url"
                  {...form.register("website")}
                />
                <FieldError message={form.formState.errors.website?.message} />
              </div>
              <div>
                <label className="text-sm font-medium text-btf-text">
                  Estimated monthly volume (optional)
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-btf-border bg-btf-bg/50 px-3 py-3 text-base text-btf-text placeholder:text-btf-text-muted focus:outline-none focus:ring-2 focus:ring-btf-accent/70"
                  placeholder="$"
                  {...form.register("monthlyVolume")}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-btf-text">
                Message (optional)
              </label>
              <textarea
                className="mt-2 min-h-[120px] w-full resize-y rounded-lg border border-btf-border bg-btf-bg/50 px-3 py-3 text-base text-btf-text placeholder:text-btf-text-muted focus:outline-none focus:ring-2 focus:ring-btf-accent/70"
                {...form.register("message")}
              />
              <FieldError message={form.formState.errors.message?.message} />
            </div>

            {state.status === "error" ? (
              <p className="text-sm text-red-300">{state.message}</p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" variant="primary" disabled={disabled}>
                {disabled ? "Submitting..." : "Submit"}
              </Button>
              <p className="text-sm text-btf-text-muted">
                We will follow up with next steps. No promises.
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

