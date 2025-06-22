import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [typography],
};

export default config;