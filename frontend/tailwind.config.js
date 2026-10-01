/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cockpit: {
          bg: '#0E1420',
          card: '#151D2A',
          border: '#222E42',
          input: '#1A2436',
          text: '#E8EAF0',
          muted: '#8A99AD',
          accent: '#3B82F6',
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}
