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
        charcoal: {
          DEFAULT: '#141619',
          light: '#1C1F23',
          dark: '#0D0F11',
          surface: '#1E2227',
        },
        obsidian: '#141619',
        graphite: '#1C1F23',
        'graphite-light': '#252930',
        'graphite-border': '#2E333C',
        pearl: '#F7F7F5',
        'soft-grey': '#E8E8E5',
        'muted-text': '#878A8E',
        'aura-blue': {
          DEFAULT: '#5C7CFF',
          hover: '#4C6EF5',
          muted: 'rgba(92, 124, 255, 0.12)',
          glow: 'rgba(92, 124, 255, 0.25)',
        },
        'aura-green': {
          DEFAULT: '#34D399',
          muted: 'rgba(52, 211, 153, 0.12)',
        },
        'aura-red': {
          DEFAULT: '#F87171',
          muted: 'rgba(248, 113, 113, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Geist Mono', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.5)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-light-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.06)',
        'glass-light-md': '0 8px 30px 0 rgba(0, 0, 0, 0.08)',
        'glow-blue': '0 0 24px 0 rgba(92, 124, 255, 0.35)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'refract': 'refractLight 4s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        refractLight: {
          '0%': { transform: 'translateX(-100%) rotate(25deg)' },
          '100%': { transform: 'translateX(200%) rotate(25deg)' },
        },
      }
    },
  },
  plugins: [],
}
