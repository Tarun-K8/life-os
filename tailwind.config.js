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
        dark: {
          bg: '#0a0d14',
          card: '#111522',
          surface: '#171c2d',
          border: '#1f263d',
          muted: '#8b9bb4',
        },
        accent: {
          primary: '#6366f1',
          secondary: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#f43f5e',
          purple: '#a855f7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
