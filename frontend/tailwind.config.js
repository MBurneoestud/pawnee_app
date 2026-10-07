/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#100f0d",
        panel: "#191713",
        "panel-raised": "#211e18",
        line: "#393329",
        mist: "#bcb4a5",
        signal: "#d9a441",
        earth: "#a85f45",
        "earth-light": "#d99a78",
        prairie: "#82906b",
      },
      boxShadow: {
        glow: "0 0 44px rgba(217, 164, 65, 0.13)",
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"],
        mono: ["DM Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
