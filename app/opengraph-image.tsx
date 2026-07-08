import { ImageResponse } from "next/og";
import { BRAND_LINE, SITE_NAME } from "@/lib/constants";

export const alt = `${SITE_NAME} - ${BRAND_LINE}`;
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
            "linear-gradient(rgba(30,58,110,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,110,0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: -0.5,
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: "#EAF1FD", textTransform: "uppercase" }}>
            Built Together
          </span>
          <span style={{ color: "#60A5FA", textTransform: "uppercase" }}>
            Funding
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              textTransform: "uppercase",
              maxWidth: 1050,
            }}
          >
            <span style={{ color: "#EAF1FD" }}>Funding is a</span>
            <span style={{ color: "#EAF1FD" }}>
              {"commitment\u00A0"}
              <span style={{ color: "#60A5FA" }}>to growth.</span>
            </span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#9FB3D9",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Capacity capital for service businesses - underwritten on real
            numbers, reviewed by a person.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
