import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = `${SITE_NAME} - ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card follows the drunk test: one plain-words message. The platform
 * already shows og:title (the category line) and the URL below the image,
 * so the image itself never repeats them.
 */
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
          padding: 80,
          backgroundColor: "#081123",
          backgroundImage:
            "radial-gradient(900px 500px at 85% 110%, rgba(59,130,246,0.22), transparent 70%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          <span style={{ color: "#EAF1FD" }}>Built Together</span>
          <span style={{ color: "#60A5FA" }}>Funding</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -3,
            maxWidth: 1000,
            paddingBottom: 24,
          }}
        >
          <span style={{ color: "#EAF1FD" }}>Money to grow</span>
          <span style={{ color: "#60A5FA" }}>your business.</span>
        </div>
      </div>
    ),
    size,
  );
}
