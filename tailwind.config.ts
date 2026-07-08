import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        btf: {
          // Bright, clean, friendly (OnDeck-like) palette
          bg: "#FFFFFF",
          secondary: "#F7F8FA",
          card: "#FFFFFF",
          muted: "#EEF2F7",
          border: "#E5E7EB",
          subtle: "#CBD5E1",
          accent: "#1D4ED8",
          "accent-mid": "#2563EB",
          "accent-soft": "#3B82F6",
          text: "#0F172A",
          "text-muted": "#475569",
          // Deep navy "ink" family for dark brand sections (same blue family)
          ink: "#081123",
          "ink-2": "#0C1A38",
          "ink-3": "#122650",
          "ink-border": "#1E3A6E",
          "on-ink": "#EAF1FD",
          "on-ink-muted": "#9FB3D9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.25rem",
          lg: "2rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1200px",
          "2xl": "1280px",
        },
      },
      boxShadow: {
        "btf-card":
          "0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.08)",
        "btf-glow": "0 8px 22px rgba(29, 78, 216, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "glow-soft": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "bolt-wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(-5deg)" },
          "40%": { transform: "rotate(4deg)" },
          "60%": { transform: "rotate(-3deg)" },
          "80%": { transform: "rotate(2deg)" },
        },
        "bolt-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "glow-soft": "glow-soft 3.5s ease-in-out infinite",
        "bolt-wiggle": "bolt-wiggle 0.55s ease-in-out both",
        "bolt-breathe": "bolt-breathe 2.8s ease-in-out infinite",
        "marquee-x": "marquee-x 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
