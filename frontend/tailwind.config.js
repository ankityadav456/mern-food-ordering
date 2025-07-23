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
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        slideUp: 'slideUp 0.4s ease-out forwards',
      },
      colors: {
        // 🍽 Primary (buttons, highlights)
        primary: {
          light: '#FF5722',
          dark: '#FF7043',
        },
        // 🌟 Secondary (headings, stars)
        secondary: {
          light: '#FFC107',
          dark: '#FFD54F',
        },
        // 🧱 Backgrounds
        background: {
          light: '#FAFAFA',
          dark: '#121212',
        },
        // 🧊 Surfaces (cards, modals)
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        // 📝 Text
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
}
