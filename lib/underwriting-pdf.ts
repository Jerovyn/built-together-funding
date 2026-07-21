import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { LeadPackageRow } from "@/lib/admin-leads";
import { formatUseOfFunds } from "@/lib/admin-leads";
import { maskSsn } from "@/lib/ssn-mask";
import {
  DISCLAIMER_PREQUAL_LINE,
  LEGAL_NO_GUARANTEE_LINE,
  SITE_NAME,
} from "@/lib/constants";

const ACCENT = rgb(0.114, 0.306, 0.847); // #1D4ED8
const INK = rgb(0.031, 0.067, 0.137); // near #081123
const MUTED = rgb(0.35, 0.4, 0.48);
const LINE = rgb(0.85, 0.88, 0.92);

function wrapText(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

async function loadLogoBytes(): Promise<Uint8Array | null> {
  try {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "brand",
      "btf-logo-tools.png",
    );
    return new Uint8Array(await readFile(logoPath));
  } catch {
    return null;
  }
}

/**
 * Branded underwriting application PDF for partner / lender packages.
 */
export async function buildApplicationPdf(
  lead: LeadPackageRow,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]); // US Letter
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  const contentWidth = 612 - margin * 2;
  let y = 744;

  const logoBytes = await loadLogoBytes();
  if (logoBytes) {
    try {
      const logo = await doc.embedPng(logoBytes);
      const logoH = 36;
      const logoW = (logo.width / logo.height) * logoH;
      page.drawImage(logo, {
        x: margin,
        y: y - logoH,
        width: logoW,
        height: logoH,
      });
    } catch {
      /* logo optional */
    }
  }

  page.drawText(SITE_NAME, {
    x: margin + 100,
    y: y - 18,
    size: 16,
    font: fontBold,
    color: INK,
  });
  page.drawText("Underwriting application package", {
    x: margin + 100,
    y: y - 36,
    size: 10,
    font,
    color: MUTED,
  });

  y -= 56;
  page.drawRectangle({
    x: margin,
    y: y - 2,
    width: contentWidth,
    height: 3,
    color: ACCENT,
  });
  y -= 28;

  page.drawText("CONFIDENTIAL — For underwriting partners only", {
    x: margin,
    y,
    size: 9,
    font: fontBold,
    color: ACCENT,
  });
  y -= 28;

  const owner =
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    lead.name ||
    "—";
  const home = [lead.home_address, lead.home_state, lead.home_zip]
    .filter(Boolean)
    .join(", ");
  const bizAddr = [
    lead.business_address,
    lead.business_city,
    lead.business_state,
    lead.business_zip,
  ]
    .filter(Boolean)
    .join(", ");

  type Row = [string, string];
  // Omit email/phone, lead id, timestamps, pre-screen, and attribution
  // so packages can be shared with lenders without exposing contact for lead theft.
  const sections: { title: string; rows: Row[] }[] = [
    {
      title: "Owner",
      rows: [
        ["Name", owner],
        ["Date of birth", lead.dob ?? "—"],
        ["SSN", lead.ssn?.trim() ? lead.ssn : maskSsn(lead.ssn)],
        ["Home address", home || "—"],
      ],
    },
    {
      title: "Business",
      rows: [
        ["Legal / DBA name", lead.business_name ?? "—"],
        ["Entity type", lead.legal_entity ?? "—"],
        ["EIN / Federal ID", lead.federal_id ?? "—"],
        ["Business address", bizAddr || "—"],
        ["Time in business", lead.time_in_business ?? "—"],
      ],
    },
    {
      title: "Funding request",
      rows: [
        ["Amount requested", lead.funding_amount ?? "—"],
        ["Use of funds", formatUseOfFunds(lead.use_of_funds)],
      ],
    },
  ];

  const drawSection = (
    title: string,
    rows: Row[],
    startY: number,
  ): number => {
    let cy = startY;
    if (cy < 120) {
      // simple: don't add pages mid-section for v1 — compress
      return cy;
    }
    page.drawText(title.toUpperCase(), {
      x: margin,
      y: cy,
      size: 11,
      font: fontBold,
      color: ACCENT,
    });
    cy -= 8;
    page.drawLine({
      start: { x: margin, y: cy },
      end: { x: margin + contentWidth, y: cy },
      thickness: 0.5,
      color: LINE,
    });
    cy -= 16;

    for (const [label, value] of rows) {
      const valueLines = wrapText(String(value), font, 10, contentWidth - 150);
      page.drawText(label, {
        x: margin,
        y: cy,
        size: 9,
        font: fontBold,
        color: MUTED,
      });
      for (let i = 0; i < valueLines.length; i++) {
        page.drawText(valueLines[i], {
          x: margin + 150,
          y: cy - i * 12,
          size: 10,
          font,
          color: INK,
          maxWidth: contentWidth - 150,
        });
      }
      cy -= Math.max(16, valueLines.length * 12 + 4);
      if (cy < 100) break;
    }
    return cy - 10;
  };

  for (const section of sections) {
    y = drawSection(section.title, section.rows, y);
  }

  // Footer band
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 612,
    height: 72,
    color: rgb(0.97, 0.98, 0.99),
  });
  const footLines = wrapText(
    `${DISCLAIMER_PREQUAL_LINE} ${LEGAL_NO_GUARANTEE_LINE} Package prepared by ${SITE_NAME}.`,
    font,
    7,
    contentWidth,
  );
  let fy = 52;
  for (const line of footLines.slice(0, 4)) {
    page.drawText(line, {
      x: margin,
      y: fy,
      size: 7,
      font,
      color: MUTED,
    });
    fy -= 10;
  }

  return doc.save();
}

/**
 * Keep PDF as-is; wrap PNG/JPEG into a single-page PDF for lender packages.
 */
export async function toStatementPdfFile(
  bytes: Uint8Array,
  fileName: string,
): Promise<{ bytes: Uint8Array; fileName: string }> {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return { bytes, fileName: fileName.replace(/[^\w.\-]+/g, "_") };
  }

  const doc = await PDFDocument.create();
  let embedded;
  if (lower.endsWith(".png")) {
    embedded = await doc.embedPng(bytes);
  } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    embedded = await doc.embedJpg(bytes);
  } else {
    // Unknown type — still try as PDF passthrough name
    return {
      bytes,
      fileName: fileName.replace(/[^\w.\-]+/g, "_") + ".bin",
    };
  }

  const maxW = 612 - 48;
  const maxH = 792 - 48;
  const scale = Math.min(maxW / embedded.width, maxH / embedded.height, 1);
  const w = embedded.width * scale;
  const h = embedded.height * scale;
  const page = doc.addPage([612, 792]);
  page.drawImage(embedded, {
    x: (612 - w) / 2,
    y: (792 - h) / 2,
    width: w,
    height: h,
  });

  const out = await doc.save();
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[^\w.\-]+/g, "_");
  return { bytes: out, fileName: `${base}.pdf` };
}
