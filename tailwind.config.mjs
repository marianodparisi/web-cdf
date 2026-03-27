/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#C5A059',
        'primary-dark': '#A8893D',
        secondary: '#E8E8E8',
        tertiary: '#2B2B2B',
        charcoal: '#3A3A3A',
        'light-gray': '#F3F4F6',
      },
      fontFamily: {
        display: ['Newsreader', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
