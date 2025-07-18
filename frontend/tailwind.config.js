/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        calming: {
          light: "#E0F2F1",
          DEFAULT: "#80CBC4",
          dark: "#004D40",
        },
      },
    },
  },
  plugins: [],
}
