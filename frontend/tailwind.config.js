/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      colors: {
        dark: {
          950: '#060910',
          900: '#080C14',
          850: '#0B101C',
          800: '#0E1524',
          750: '#131B2E',
          700: '#18233A',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.05)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          borderFocus: 'rgba(59, 130, 246, 0.5)',
        },
        cockpit: {
          bg: '#080C14',
          card: '#0E1524',
          border: '#1F293D',
          input: '#131B2E',
          text: '#E8EAF0',
          muted: '#8A99AD',
          accent: '#3B82F6',
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          blue: '#3B82F6',
          cyan: '#06B6D4',
          emerald: '#10B981',
        },
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.08) 35%, transparent 70%)',
        'aurora-mesh': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.22), rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.05), transparent)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px -5px rgba(59, 130, 246, 0.2), 0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'rose-glow': '0 0 25px -5px rgba(244, 63, 94, 0.25)',
      },
      animation: {
        'aurora': 'aurora 18s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.9 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
