import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        crimson: { DEFAULT: '#8B1A4A', light: '#C0426E', dark: '#5e1032' },
        blush: { DEFAULT: '#f7e8ef', deep: '#efd0de' },
        gold: { DEFAULT: '#C9933A', light: '#f0d49a' },
        cream: '#fdf8f3',
      },
      animation: {
        fadeInUp: 'fadeInUp 0.4s ease-out forwards',
        scaleIn: 'scaleIn 0.3s ease-out forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeInUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};

export default config;
