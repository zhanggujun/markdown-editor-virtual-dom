const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    autoprefixer({
      'overrideBrowserslist': [
        'last 20 versions'
      ]
    })
  ]
}
