/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#1E1E1E',
        'custom-indigo': '#4B0082',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
