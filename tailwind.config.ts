import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        surface: "var(--surface)",
        primary: "#1C2B3A",
        secondary: "#2E3F52",
        accent: "#D4A843",
        "accent-dark": "#B8922E",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-barlow)", "sans-serif"],
        condensed: ["var(--font-barlow-condensed)", "sans-serif"],
      },
      boxShadow: {
        nav: "0 2px 12px rgba(28, 43, 58, 0.08)",
        "nav-dark": "0 2px 12px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
