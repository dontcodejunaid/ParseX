/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          forest: '#445D48',
          cream: '#FDE5D4',
          gold: '#D6CC99',
          midnight: '#001524',
          chestnut: '#5E3023',
        },
        brand: {
          50: '#F9F5EF',
          100: '#FDE5D4',
          200: '#EBD4C1',
          400: '#D6CC99',
          500: '#445D48',
          600: '#384D3B',
          700: '#5E3023',
          800: '#422218',
          900: '#001524',
          950: '#000E18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
