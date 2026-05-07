/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Material Design Amber — #FFCA28 (amber-400) is the brand accent,
        // matched to the Drumforge OG image. Other shades cover hover/active
        // states and dark-mode contrast variants.
        accent: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
          DEFAULT: '#FFCA28',
        },
      },
    },
  },
  plugins: [],
};
