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

  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial'
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [ 'env', { useBuiltIns: true } ]
          ]
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'imgs/[name].[hash].[ext]'
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
