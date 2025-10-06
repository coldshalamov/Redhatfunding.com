import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        success: '#16a34a',
        error: '#b91c1c',
      },
      fontFamily: {
        sans: ['"Inter"', '"DM Sans"', 'system-ui', 'sans-serif'],
        heading: ['"DM Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        lift: '0 12px 36px rgba(11,19,32,.08)',
      },
    },
  },
  plugins: [],
};

export default config;
