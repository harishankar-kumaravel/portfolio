/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        abyss: 'var(--color-abyss)',
        deep: 'var(--color-deep)',
        panel: 'var(--color-panel)',
        mist: 'var(--color-mist)',
        teal: 'var(--color-teal)',
        foam: 'var(--color-foam)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        glow: '0 22px 80px rgba(5, 31, 27, 0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease both',
      },
    },
  },
  plugins: [],
}
