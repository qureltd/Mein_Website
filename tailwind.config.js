/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          mein: '#2F6BFF',
          light: '#5B8FFF',
          dark: '#1A4FCC',
          pale: '#EBF0FF',
        },
        gold: {
          mein: '#F4B400',
          light: '#FFCF3D',
          dark: '#C48F00',
          pale: '#FFF8E1',
        },
        charcoal: '#111111',
        gray: {
          support: '#E6E9EE',
          mid: '#9DA4B0',
          dark: '#4A5568',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'orbit 28s linear infinite',
        'spin-slow-reverse': 'orbitReverse 18s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        orbitReverse: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}
