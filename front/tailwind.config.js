/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "primary": "#060522",
        "secondary": "#18173B",
      },
      fontFamily: {
        "rubik": ["Rubik", "sans-serif"],
      },
    },
  },
  plugins: [],
};
