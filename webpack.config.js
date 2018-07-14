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

  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.json$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  }
};
