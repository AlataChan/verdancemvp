/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f7f5',
          100: '#e6f0eb',
          200: '#c9e0d7',
          300: '#a5cabb',
          400: '#7aaf9a',
          500: '#3f7a5a',
          600: '#396e51',
          700: '#2d5c43',
          800: '#254a37',
          900: '#1e3c2d',
          950: '#0f2218',
        },
        secondary: {
          50: '#f7f9fa',
          100: '#e9eef2',
          200: '#d3dde6',
          300: '#afc3d3',
          400: '#8aa2bb',
          500: '#6d84a4',
          600: '#566a8c',
          700: '#435373',
          800: '#394560',
          900: '#1c2e42',
          950: '#111827',
        },
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
    },
  },
  plugins: [],
} 