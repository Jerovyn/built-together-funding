import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = `${SITE_NAME} - ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#081123",
          backgroundImage:
            "radial-gradient(800px 420px at 90% 100%, rgba(29,78,216,0.28), transparent 65%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#EAF1FD" }}>Built Together</span>
          <span style={{ color: "#60A5FA" }}>Funding</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 980,
            paddingBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.5,
              color: "#EAF1FD",
            }}
          >
            Booked out? Get funding for the next truck, crew, or machine.
          </div>
          <div style={{ fontSize: 24, color: "#9FB3D9" }}>
            Small business funding · Trades & service · 1 business day
          </div>
        </div>
      </div>
    ),
    size,
  );
}
