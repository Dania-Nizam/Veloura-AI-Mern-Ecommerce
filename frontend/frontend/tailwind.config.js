/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {animation: {
        'scroll-horizontal': 'scroll-horizontal 30s linear infinite',
      },keyframes: {
        'scroll-horizontal': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }, // Adhi list move hone par reset ho jayega
        }
      }},
  },
  plugins: [],
}

