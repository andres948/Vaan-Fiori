/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        linen: '#FBF6EF',
        porcelain: '#FFFDFA',
        clay: '#3A2E2A',
        bark: '#5B4A42',
        rose: {
          50: '#FBF0EE',
          100: '#F4DBD7',
          300: '#E3AFA6',
          400: '#CE8A7D',
          500: '#B96F60',
          600: '#9C574A',
          700: '#7C4238',
        },
        sage: {
          100: '#E7EBDE',
          300: '#B7C29E',
          500: '#7C8F5F',
          600: '#5E6F45',
          700: '#48562F',
        },
        sand: '#EDE4D3',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -12px rgba(58, 46, 42, 0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
