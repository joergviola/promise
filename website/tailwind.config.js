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
      }
    },
    fontFamily: {
      'body': ['Roboto', 'sans-serif'],
    }      
  },
  variants: {},
  plugins: [],
}
