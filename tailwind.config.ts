import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        black: "#000",
        white: "#fff",
        primary: {
          100: "#fef3dc",
          200: "#fee7ba",
          300: "#fdda97",
          400: "#fdce75",
          500: "#fcc252",
          600: "#ca9b42",
          700: "#977431",
          800: "#654e21",
          900: "#322710",
        },
        secondary: {
          100: "#f8d2d4",
          200: "#f1a6a8",
          300: "#ea797d",
          400: "#e34d51",
          500: "#dc2026",
          600: "#b01a1e",
          700: "#841317",
          800: "#580d0f",
          900: "#2c0608",
        },
        tertiary: {
          100: "#e5d0d0",
          200: "#cba2a2",
          300: "#b27373",
          400: "#984545",
          500: "#7e1616",
          600: "#651212",
          700: "#4c0d0d",
          800: "#320909",
          900: "#190404",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
