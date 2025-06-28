/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'prodigy': ['Prodigy Sans', 'sans-serif'],
      },
      animation: {
        'cube3d': 'cube3d 20s linear infinite',
        'orbFloat': 'orbFloat 15s ease-in-out infinite',
        'particleFloat': 'particleFloat 8s ease-in-out infinite',
        'gridPulse': 'gridPulse 4s ease-in-out infinite',
      },
      keyframes: {
        cube3d: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(360deg)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-30px) translateX(5px)' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.4' },
          '50%': { transform: 'translateY(-20px)', opacity: '1' },
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}