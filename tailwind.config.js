/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#0D47A1', // Bleu principal demandé
          600: '#0a3a8c',
          700: '#082d77',
          800: '#052062',
          900: '#03144d',
        },
        secondary: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a', // Turquoise secondaire demandé
          500: '#26A69A',
          600: '#00897b',
          700: '#00695c',
          800: '#004d40',
          900: '#00251a',
        },
        accent: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726', // Orange accent demandé
          500: '#FFA726',
          600: '#ff9800',
          700: '#fb8c00',
          800: '#ef6c00',
          900: '#e65100',
        },
        success: {
          50: '#e8f5e8',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
        },
        warning: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
        },
        danger: {
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#f44336',
          600: '#e53935',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0D47A1 0%, #26A69A 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #26A69A 0%, #0D47A1 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFA726 0%, #0D47A1 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFA726 0%, #26A69A 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(13, 71, 161, 0.3)',
        'glow-lg': '0 0 30px rgba(13, 71, 161, 0.5)',
        'glow-secondary': '0 0 20px rgba(38, 166, 154, 0.3)',
        'glow-accent': '0 0 20px rgba(255, 167, 38, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
