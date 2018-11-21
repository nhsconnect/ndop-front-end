const path = require('path');

module.exports = {
  entry: {
    enteryourcode: ['babel-polyfill',  __dirname + '/screens/enter-your-code.js'],
    enterpassword: ['babel-polyfill',  __dirname + '/screens/enter-password.js'],
    expiredcodeerror: ['babel-polyfill',  __dirname + '/screens/expired-code-error.js'],
    reviewyourchoice: ['babel-polyfill',  __dirname + '/screens/review-your-choice.js'],
    setyourpreferences: ['babel-polyfill',  __dirname + '/screens/set-your-preferences.js'],
    thankyou: ['babel-polyfill',  __dirname + '/screens/thank-you.js'],
    verificationoption: ['babel-polyfill',  __dirname + '/screens/verification-option.js'],
    yourdetails: ['babel-polyfill',  __dirname + '/screens/your-details.js'],
    landingpage: ['babel-polyfill',  __dirname + '/screens/landing-page.js']
  },
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: __dirname + /node_modules/,
          chunks: 'all',
          name: 'vendor'
        }
      }
    }
  },
  output: {
    path: path.resolve(__dirname, '../static-resources/js/app/'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        exclude: __dirname + '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          },
        },
        test: /\.js$/,
      }
    ]
  }
};
