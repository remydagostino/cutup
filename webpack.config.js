const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.tsx',
  devtool: 'inline-source-map',
  devServer: {
    index: './index.html',
    contentBase: './docs' // <- this is for github pages
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.css' ],
  },
  output: {
    filename: 'index_bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Cut Up'
    })
  ]
};