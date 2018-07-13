const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    'index': path.resolve(__dirname, 'src', 'index.js')
  },

  devtool: false,

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  }
};
