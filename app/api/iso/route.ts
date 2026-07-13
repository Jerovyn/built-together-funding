import { NextResponse } from "next/server";
import { isoSignupSchema } from "@/lib/iso-schema";
import { DISCLAIMER_PREQUAL_LINE, SITE_NAME } from "@/lib/constants";
import {
  createResendClient,
  getInternalNotifyEmail,
  getResendFromEmail,
  isResendConfigured,
  withReplyTo,
} from "@/lib/resend";

export const runtime = "nodejs";

function jsonError(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function GET() {
  return jsonError(405, "Method not allowed");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON");
  }

  const parsed = isoSignupSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Please check the form and try again.");
  }

  const toEmail = getInternalNotifyEmail();
  if (!toEmail || !isResendConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return jsonError(503, "Server is not configured to accept submissions.");
    }
    return NextResponse.json({ ok: true, message: "Received (dev mode)." });
  }

  const { name, company, phone, email, website, monthlyVolume, message } =
    parsed.data;

  try {
    const resend = createResendClient();
    const from = getResendFromEmail();
    if (!resend || !from) throw new Error("Resend not configured");

    await resend.emails.send(
      withReplyTo(
        {
          from,
          to: [toEmail],
          subject: `${SITE_NAME} - ISO / Partner signup`,
          text: [
            "New ISO / Partner signup",
            "",
            `Name: ${name}`,
            `Company: ${company}`,
            `Phone: ${phone}`,
            `Email: ${email}`,
            website ? `Website: ${website}` : "Website: (not provided)",
            monthlyVolume
              ? `Estimated monthly volume: ${monthlyVolume}`
              : "Estimated monthly volume: (not provided)",
            message ? `Message: ${message}` : "Message: (not provided)",
            "",
            DISCLAIMER_PREQUAL_LINE,
          ].join("\n"),
        },
        email,
      ),
    );
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, message: "Received (email skipped in dev)." });
    }
    return jsonError(500, "Unable to submit right now. Please try again.");
  }

  return NextResponse.json({ ok: true, message: "Thanks - we will reach out soon." });
}

