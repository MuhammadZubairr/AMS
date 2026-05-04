const path = require('path');
const tokens = require(path.resolve(__dirname, './src/constants/design-tokens.json'));

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}', './src/hooks/**/*.{js,jsx,ts,tsx}', './src/utils/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        primaryLight: tokens.colors.primaryLight,
        success: tokens.colors.success,
        danger: tokens.colors.danger,
        warning: tokens.colors.warning,
        neutral: tokens.colors.neutral,
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
