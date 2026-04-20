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
        background: 'var(--bg-main)',
        surface: 'var(--bg-surface)',
        surfaceHighlight: 'var(--bg-surface-highlight)',
        border: 'var(--border-subtle)',
        text: 'var(--color-text-main)',
        textMuted: 'var(--color-text-muted)',
        primary: '#3b82f6',
        success: '#00d09c',
        danger: '#ef4444'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
