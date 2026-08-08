/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Section colors
        'my-stuff': '#ffffff',
        'bet-stuff': '#808080',
        'league-stuff': '#000000',
        // Primary accent
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Dark scale for backgrounds
        'dark': {
          100: '#d4d4d8',
          200: '#a1a1aa',
          300: '#71717a',
          400: '#52525b',
          500: '#3f3f46',
          600: '#27272a',
          700: '#18181b',
          800: '#09090b',
        }
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      height: {
        'screen-dvh': '100dvh',
      },
      minHeight: {
        'screen-dvh': '100dvh',
      }
    },
  },
  plugins: [],
}
