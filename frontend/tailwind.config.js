/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        potato: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        surface: {
          light: '#ffffff',
          'light-card': '#f8fafc',
          'light-border': '#e2e8f0',
          dark: '#090d16',
          'dark-card': 'rgba(15, 23, 42, 0.75)',
          'dark-border': 'rgba(245, 158, 11, 0.15)',
        }
      },
      animation: {
        'scan': 'scan 2.2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'intro-fade-in': 'introFadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'intro-breathe': 'introBreathe 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%', opacity: '0.4' },
          '50%': { top: '96%', opacity: '1' },
          '100%': { top: '0%', opacity: '0.4' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3', filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.3))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.7))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        introFadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        introBreathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
