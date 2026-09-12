/** @type {import('tailwindcss').Config} */
export default {
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
        spudDark: '#0f172a',
        spudCard: 'rgba(30, 41, 59, 0.7)'
      },
      animation: {
        'scan': 'scan 2s linear infinite',
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
