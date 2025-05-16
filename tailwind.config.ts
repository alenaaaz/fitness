import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // Синий
        secondary: '#10b981', // Зеленый
      },
    },
  },
  plugins: [],
} satisfies Config;

module.exports = {
  // ...
  theme: {
    extend: {
      colors: {
        'fc-blue': '#3b82f6',
        'fc-green': '#10b981',
      }
    }
  }
}