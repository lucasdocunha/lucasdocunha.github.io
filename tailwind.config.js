/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tinta: fundo quase preto com leve tom azul-violeta
        ink: {
          950: '#08080c',
          900: '#0d0d13',
          850: '#12121a',
          800: '#181822',
          700: '#23232f',
          600: '#30303f',
          400: '#8b8b9e',
          300: '#b4b4c4',
          100: '#ececf3',
        },
        // Brasa: acento principal (coral → âmbar)
        ember: {
          200: '#ffd2bf',
          300: '#ffad8a',
          400: '#ff8a5c',
          500: '#ff6b3d',
          600: '#e5522a',
        },
        amber: { 400: '#ffc15e' },
        // Lilás: acento secundário (agentes / pesquisa)
        lilac: {
          300: '#cbbcff',
          400: '#a995ff',
          500: '#8b72ff',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-rev': 'marquee 46s linear infinite reverse',
        blink: 'blink 1s step-end infinite',
        'spin-slow': 'spinSlow 14s linear infinite',
      },
    },
  },
  plugins: [],
};
