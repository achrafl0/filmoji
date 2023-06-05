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
          100: "#ccf5f6",
          200: "#99ebed",
          300: "#66e2e3",
          400: "#33d8da",
          500: "#00ced1",
          600: "#00a5a7",
          700: "#007c7d",
          800: "#005254",
          900: "#00292a",
        },

        secondary: {
          100: "#e6f5f6",
          200: "#cdebed",
          300: "#b5e1e3",
          400: "#9cd7da",
          500: "#83cdd1",
          600: "#69a4a7",
          700: "#4f7b7d",
          800: "#345254",
          900: "#1a292a",
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
