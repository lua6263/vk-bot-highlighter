const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const fs = require('fs')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: [
    path.resolve('src/index.ts'),
  ],

  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'ts'],
    }),
    new webpack.BannerPlugin({
      raw: true,
      banner: fs.readFileSync('./webpack/userScriptHeader.txt', 'utf8'),
    }),
  ],

  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@': path.resolve('./src'),
    },
  },

  optimization: {
    minimize: false,
  },
}
