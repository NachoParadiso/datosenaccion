import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uba: {
          blue: '#003087',
          'blue-mid': '#0055B3',
          'blue-light': '#0077CC',
          cyan: '#00A8E8',
          teal: '#00BCD4',
          'gray-bg': '#F0F4F8',
          'gray-card': '#F8FAFC',
          border: '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
