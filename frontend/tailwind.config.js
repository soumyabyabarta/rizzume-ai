/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Professional minimal font
      },
      colors: {
        brand: {
          light: '#f3f4f6', // Light background from your design
          purple: '#6B46C1', // The main primary purple
          purpleDark: '#553C9A',
          roast: '#FF4747', // For the brutal roast mode
          success: '#10B981',
          textMain: '#111827',
          textMuted: '#6B7280'
        }
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.05)', // For those clean white cards
      }
    },
  },
  plugins: [],
}