/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        spinReverse: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' }, // Reverse direction
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        slideUp: 'slideUp 0.4s ease-out forwards',
        spinSlow: 'spin 1.5s linear infinite',
        spinSlowReverse: 'spinReverse 1.5s linear infinite',
      },
      transformOrigin: {
        center: 'center',
      },
      colors: {
        primary: {
          light: '#FF5722',
          dark: '#FF7043',
        },
        secondary: {
          light: '#FFC107',
          dark: '#FFD54F',
        },
        background: {
          light: '#FAFAFA',
          dark: '#121212',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        text: {
          light: '#1E1E1E',
          dark: '#FFFFFF',
          subtleLight: '#666666',
          subtleDark: '#CCCCCC',
        },
        gold: '#D4AF37',
      },
    },
  },
  plugins: [],
};
