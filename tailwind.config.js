/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/points/**/*.{js,jsx,ts,tsx}'],
  // Prevent Tailwind from affecting the rest of reef-app.
  important: '#points-root',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};


