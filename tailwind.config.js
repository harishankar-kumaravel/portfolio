/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#071412',
        deep: '#0b1f1b',
        panel: '#102925',
        mist: '#b6ddd2',
        teal: '#19c0a2',
        foam: '#dffcf5',
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
