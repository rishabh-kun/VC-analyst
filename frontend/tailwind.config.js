/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 1. Light Canvas Background (#F6F8FB) & Secondary Surfaces (#F8FAFC)
        canvas: '#F6F8FB',
        obsidian: {
          950: '#F8FAFC', // Secondary surface
          900: '#F6F8FB', // Main canvas background
          800: '#EEF2F6', // Subtle separator / secondary surface
        },
        // 2. Pure White Surfaces & Elevation (#FFFFFF)
        slate: {
          surface: '#FFFFFF', // Primary card surface
          raised: '#F8FAFC',  // Raised / hovered surface
          overlay: '#FFFFFF',
        },
        // 3. Subtle Gray Borders (#E5E7EB, #EEF2F6, #D1D5DB)
        steel: {
          subtle: '#E5E7EB',  // Standard border
          default: '#E5E7EB',
          separator: '#EEF2F6', // Subtle separator
          emphasis: '#D1D5DB',  // Input / emphasis border
        },
        // 4. Primary Brand: Precision Cobalt / Indigo (#4F46E5, #6366F1)
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Secondary brand
          600: '#4F46E5', // Primary brand accent
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#EEF2FF',
        },
        // 5. Semantic Verdict & Risk Colors
        verdict: {
          emerald: '#10B981', // Strong Invest / Low Risk
          cyan: '#06B6D4',    // Invest
          amber: '#F59E0B',   // Watch / Medium Risk
          crimson: '#EF4444', // Do Not Invest / High Risk
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
