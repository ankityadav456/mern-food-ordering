/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // This enables dark mode based on the class
  theme: {
    extend: {
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
    slideUp: {
      '0%': { transform: 'translateY(20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
  },
  animation: {
    fadeIn: 'fadeIn 0.6s ease-out',
    slideUp: 'slideUp 0.4s ease-out forwards',
  },
  colors: {
    gold: '#D4AF37',
  },
},

  },
  plugins: [],
}

