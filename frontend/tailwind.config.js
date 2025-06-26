/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        'screen-minus-nav': 'calc(100vh - 64px)', // Assuming a 64px tall navbar
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 