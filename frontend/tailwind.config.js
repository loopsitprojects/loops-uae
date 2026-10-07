/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Roboto"', 'ui-sans-serif', 'system-ui'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"Space Mono"', 'ui-monospace'],
      },
      colors: {
        brand: {
          pink: '#E8005A',
          purple: '#7B2FBE',
          blue: '#1B3FB5',
          teal: '#00B4B4',
          dark: '#0A0A0A',
          light: '#F5F5F5',
        },
      },
      transitionTimingFunction: {
        agency: 'cubic-bezier(0.76, 0, 0.24, 1)',
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontWeight: {
        '300': '300',
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
        '800': '800',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
