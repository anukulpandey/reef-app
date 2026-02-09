const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('process');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, "src", "index.tsx"),

  output: {
    path:path.resolve(__dirname, "public"),
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        loader: 'file-loader',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(
            __dirname,
            'node_modules/@reef-chain/ui-kit/src/ui-kit/assets/avatars',
          ),
        ],
      },
      {
        test: /\.m?js/,
        type: "javascript/auto",
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /favicon\.ico$/,
        loader: 'url-loader',
      },
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.cjs'],
    alias: {
      // @formo/analytics optionally requires `viem`. We don't use it directly, and
      // some viem versions require TS5+ types which break our TS4 toolchain.
      // This shim keeps the build green and makes analytics fall back gracefully.
      viem: path.resolve(__dirname, 'src/shims/viem.js'),
    },
    fallback: {
      'crypto': require.resolve('crypto-browserify'),
      'stream': require.resolve('stream-browserify'),
      'vm': false,
    },
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    port: 3000,
    historyApiFallback: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index-template.html"),
      favicon: path.join(__dirname, "public", "favicon.ico")
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
}
