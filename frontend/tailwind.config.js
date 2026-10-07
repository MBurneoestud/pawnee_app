/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#090b10",
        panel: "#111520",
        "panel-raised": "#171c29",
        line: "#252b39",
        mist: "#a7afc1",
        signal: "#52d7f5",
        violet: "#8c78e8",
      },
      boxShadow: {
        glow: "0 0 44px rgba(82, 215, 245, 0.11)",
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"],
        mono: ["DM Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
