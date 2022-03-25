const path = require("path");
const resolveAppPath = (relativePath) =>
  path.resolve(appDirectory, relativePath);
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: "./src/app.js",
  output: {
    filename: "bundle.js",
  },
  devtool: "source-map",
  devServer: {
    hot: true,
    static: "./",
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      template: resolveAppPath("./index.html"),
    }),
    new MiniCssExtractPlugin(),
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
};
