module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './hooks/**/*.{js,jsx,ts,tsx}', './utils/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        devflx: {
          DEFAULT: '#1e6fdb',
          light: '#58a0ff'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    }
  },
  plugins: []
};
