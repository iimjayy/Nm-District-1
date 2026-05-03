/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 40px rgba(2, 6, 16, 0.28)',
        glow: '0 0 0 1px rgba(124, 58, 237, 0.2), 0 18px 40px rgba(124, 58, 237, 0.18)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at center, rgba(124, 58, 237, 0.3), transparent 60%)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(0.94)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(var(--dx), var(--dy), 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
        drift: 'drift var(--duration, 16s) ease-in-out infinite',
        shimmer: 'shimmer 1.4s linear infinite',
      },
      colors: {
        district: {
          navy: '#07091A',
          ink: '#0B1026',
          mist: '#94A3B8',
          violet: '#7C3AED',
          amber: '#F59E0B',
          rose: '#F472B6',
          blue: '#3B82F6',
        },
      },
    },
  },
  plugins: [],
};
