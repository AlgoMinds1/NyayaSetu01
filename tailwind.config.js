/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aicte: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          500: '#1e5a8a',
          600: '#164870',
          700: '#113757',
          800: '#0c273e',
          900: '#071826',
        },
        india: {
          saffron: '#FF9933',
          green: '#138808',
          navy: '#000080',
        }
      }
    },
  },
  plugins: [],
}
