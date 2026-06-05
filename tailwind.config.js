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
        sans: ['Inter', 'sans-serif'],
        display: ['Satoshi', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 22px 80px rgba(11, 14, 20, 0.5)',
        'glow-teal': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-soft': '0 10px 30px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.08)' },
        }
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease both',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
