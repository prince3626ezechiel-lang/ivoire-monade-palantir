/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1E293B',
          forest: '#166534',
          gold: '#A17846',
          yellow: '#F1C40F',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
