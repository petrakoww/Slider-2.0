const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "app.[contenthash].js",
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "slider2.0 bitbucket",
      filename: "./index.html",
      template: "index.html",
      inject: "body",
    }),
    new CleanPlugin.CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.js?$/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        sourceMap: true,
      }),
    ],
  },
};
