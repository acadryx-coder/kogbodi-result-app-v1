import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#003366",    // Deep Kogbodi blue
          50: "#f0f7ff",
          100: "#e0f0ff",
          500: "#003366",
          600: "#002855",
          700: "#001f44",
          900: "#000f22",
        },
        accent: "#ADD8E6",       // Light blue
        background: "#FFFFFF",
        foreground: "#1e293b",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
