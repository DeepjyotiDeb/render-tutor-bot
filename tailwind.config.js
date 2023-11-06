/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const Myclass = plugin(function ({ addUtilities }) {
  addUtilities({
    '.my-rotate-y-180': {
      transform: 'rotateY(180deg)',
    },
    '.preserve-3d': {
      transformStyle: 'preserve-3d',
    },
    '.perspective': {
      perspective: '500px',
    },
    '.backface-hidden': {
      backfaceVisibility: 'hidden',
    },
  });
});

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
    fontSize: {
      sm: '0.55rem',
      base: '1.125rem',
      xl: '1.71rem',
      '2xl': '2.14rem',
      '3xl': '2.68rem',
      '4xl': '3.35rem',
      '5xl': '4.19rem',
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
    },
  },
  plugins: [Myclass, require('@tailwindcss/typography')],
};
