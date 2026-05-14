/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        feather: ['var(--font-feather)'],
        sans: ['var(--font-din-round)'],
        mono: ['monospace'],
      },
      colors: {
        'duo-green': 'var(--color-duo-green)',
        'sky-blue': 'var(--color-sky-blue)',
        'duo-green-light': 'var(--color-duo-green-light)',
        'sunshine-yellow': 'var(--color-sunshine-yellow)',
        'grape-soda': 'var(--color-grape-soda)',
        'bubblegum-pink': 'var(--color-bubblegum-pink)',
        'snow-white': 'var(--color-snow-white)',
        'cloud-gray': 'var(--color-cloud-gray)',
        silver: 'var(--color-silver)',
        graphite: 'var(--color-graphite)',
        charcoal: 'var(--color-charcoal)',
        'almost-black': 'var(--color-almost-black)',
      },
      borderRadius: {
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        'duo-green': '0 4px 0 #3f8f01',
        'sky-blue': '0 4px 0 #1899d6',
        'cloud-gray': '0 4px 0 var(--color-cloud-gray)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
