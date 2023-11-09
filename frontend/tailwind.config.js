/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navbar: "#233D3C",
        hr: "#315553",
        "navbar-hover": "#3b6765",
        button: "#84b8b6",
        "light-button": "#9fc8c7",
        "navbar-font": "#FFFAF4",
      },
    },
    fontFamily: {
      assistant: ["Assistant"],
    },
  },
  plugins: [],
};
