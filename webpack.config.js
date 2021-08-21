const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const fs = require('fs')

module.exports = {
  entry: [
      path.resolve('src/index.js')
  ],
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({
        raw: true,
        banner: fs.readFileSync('./src/userScriptHeader.txt', "utf8")
    })
  ],

  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve('./src'),
    },
  },

  optimization: {
    minimize: false
  }
}