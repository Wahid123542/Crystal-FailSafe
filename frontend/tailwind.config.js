/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'crystal-blue': '#0066CC',
        'crystal-dark': '#1a1a1a',
        'crystal-light': '#f5f5f5',
        'crystal-green': '#2D5F3F',
        'crystal-accent': '#FF6B35',
      },
    },
  },
  plugins: [],
}