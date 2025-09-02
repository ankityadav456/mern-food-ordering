/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#FF5722',   // Orange for Light Mode
          dark: '#FF7043',    // Slightly brighter for Dark Mode
        },
        secondary: {
          light: '#FFC107',   // Amber for Light Mode
          dark: '#FFD54F',    // Lighter Amber for Dark Mode
        },
        background: {
          light: '#FAFAFA',   // Light BG
          dark: '#121212',    // Dark BG
        },
        surface: {
          light: '#FFFFFF',   // Card, Modal BGs in Light Mode
          dark: '#1E1E1E',    // Card, Modal BGs in Dark Mode
        },
        text: {
          light: '#1E1E1E',       // Primary text Light
          dark: '#FFFFFF',        // Primary text Dark
          subtleLight: '#666666', // Subtle Light text
          subtleDark: '#CCCCCC',  // Subtle Dark text
        },
        gold: '#D4AF37',
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        slideUp: 'slideUp 0.4s ease-out forwards',
        spinSlow: 'spin 1.5s linear infinite',
        spinSlowReverse: 'spinReverse 1.5s linear infinite',
        shimmer: 'shimmer 6s linear infinite', // ✅ Added shimmer
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
          to: { transform: 'rotate(-360deg)' },
        },
        shimmer: { // ✅ Added shimmer keyframes
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transformOrigin: {
        center: 'center',
      },
    },
  },
  plugins: [],
}
