module.exports = {
  purge: [
    './docs/**/*.html',
    './docs/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4599DF',
        secondary: '#F0B544',
      },
      scale: {
        '200': '2.15'
      }
    },
    fontFamily: {
      'body': ['Roboto', 'sans-serif'],
    }      
  },
  variants: {},
  plugins: [],
}
