import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        paint: ['var(--font-paint)', 'cursive', 'system-ui'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#1a2340',
          50: '#eaecf4',
          100: '#c5cbe1',
          200: '#a1aacc',
          300: '#7c89b8',
          400: '#5868a4',
          500: '#3d4d8b',
          600: '#2f3b6c',
          700: '#20294d',
          800: '#1a2340', // Base
          900: '#0a0d18',
        },
        amber: {
          DEFAULT: '#f0a500',
          50: '#fef6e5',
          100: '#fde8b8',
          200: '#fbd98a',
          300: '#facb5d',
          400: '#f8bc2f',
          500: '#f0a500', // Base
          600: '#c08400',
          700: '#906300',
          800: '#604200',
          900: '#302100',
        },
        offwhite: {
          DEFAULT: '#faf8f5',
          dark: '#e6e0d4',
        },
        marmalade: {
          DEFAULT: '#F5A623',
          deep: '#e09115',
        },
        punch: {
          DEFAULT: '#E63678',
        },
        cream: {
          DEFAULT: '#FCF6E8',
          warm: '#Fdfaf0',
          shadow: '#efe6d5',
        },
        ink: {
          DEFAULT: '#14182E',
          mid: '#6A7196',
        },
        cyan: {
          DEFAULT: '#2BC9E6',
        },
        acid: {
          DEFAULT: '#B6E94B',
        },
        grape: {
          DEFAULT: '#8B5BD6',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(26, 35, 64, 0.8) 0%, rgba(26, 35, 64, 0.4) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(26, 35, 64, 0.05)',
        'glass-hover': '0 8px 32px 0 rgba(240, 165, 0, 0.15)',
        'neon': '0 0 15px rgba(240, 165, 0, 0.5), 0 0 30px rgba(240, 165, 0, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
