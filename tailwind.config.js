/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'carDrift': 'carDrift 3s ease-in-out infinite',
        'wheelSpin': 'wheelSpin 1s linear infinite',
        'tireTrack': 'tireTrack 1s linear infinite',
        'smokeRise': 'smokeRise 1.5s ease-out infinite',
        'sparkle': 'sparkle 0.8s ease-out infinite',
        'circuit-line': 'circuit-line 8s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'slideIn': 'slideIn 0.3s ease-out',
        'energyPulse': 'energyPulse 2s ease-out infinite',
        'energyLine': 'energyLine 1.5s ease-out infinite',
      },
      keyframes: {
        'circuit-line': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        energyLine: {
          '0%': { 
            opacity: 0,
            transform: 'scaleY(0)'
          },
          '50%': { 
            opacity: 1,
            transform: 'scaleY(1)'
          },
          '100%': { 
            opacity: 0,
            transform: 'scaleY(0)'
          }
        },
        energyPulse: {
          '0%': { 
            opacity: 0,
            transform: 'scale(0.95)'
          },
          '50%': { 
            opacity: 1,
            transform: 'scale(1)'
          },
          '100%': { 
            opacity: 0,
            transform: 'scale(0.95)'
          }
        }
      },
      colors: {
        'custom':'red',
        'bg':'green',
        'yelloww': '#fbc40c',
      },
      boxShadow: {
        
      }
    },
  },
  plugins: [],
};
