/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a',
        'bg-card': '#111111',
        'bg-card-hover': '#161616',
        'border-dark': '#1f1f1f',
        accent: '#e63a2e',
        'accent-orange': '#ff5533',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-muted': '#444444',
        success: '#22c55e',
        warning: '#F59E0B',
        danger: '#EF4444',
        'bg-dark': '#0a0a0a',
        surface: '#111111',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
