module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },

  theme: {
    extend: {
      animation: {
        expandDown: 'expandDown 0.3s ease-out forwards',
      },
      keyframes: {
        expandDown: {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '100px' },
        },
      },
    },
  },
}
