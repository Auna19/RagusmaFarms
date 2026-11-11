/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#0F5128',
          900: '#0A3B1D',
          950: '#052210',
        },
        earth: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#E8DCCB',
          300: '#D6C0A6',
          400: '#C29F7C',
          500: '#A97D54',
          600: '#8A603E',
          700: '#6D4A2F',
          800: '#543825',
          900: '#3D281C',
        },
        cream: {
          50: '#FDFCF7',
          100: '#FAF8EE',
          200: '#F4EEDC',
          300: '#ECE2C5',
          400: '#DFD1A5',
          500: '#D0BC81',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      }
    },
  },
  plugins: [],
};
