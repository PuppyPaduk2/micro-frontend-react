const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const wp = (callback = (value) => value) => {
  return callback;
};

const webpackConfig = (config = {}) => {
  return {
    entry: wp(config.entry)(["core-js/stable", "./src/index"]),
    mode: wp(config.mode)("development"),
    target: wp(config.target)(["web", "es5"]),
    module: wp(config.module)({
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)?$/,
          use: {
            loader: path.resolve(__dirname, "../node_modules/babel-loader"),
            options: require("./babel.config")(),
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            path.resolve(__dirname, "../node_modules/css-loader"),
          ],
        },
        {
          test: /\.svg$/,
          use: [
            path.resolve(__dirname, "../node_modules/@svgr/webpack"),
            path.resolve(__dirname, "../node_modules/url-loader"),
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            { loader: path.resolve(__dirname, "../node_modules/url-loader") },
          ],
        },
      ],
    }),
    resolve: wp(config.resolve)({
      extensions: [".tsx", ".ts", ".js"],
      modules: [
        path.resolve(process.cwd(), "./src"),
        path.resolve(process.cwd(), "./node_modules"),
      ],
    }),
    externals: wp(config.externals)({}),
    output: wp(config.output)({
      filename: "index.js",
      path: path.resolve(process.cwd(), "dist"),
      publicPath: `http://localhost:3000/`,
    }),
    plugins: wp(config.plugins)([
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        // hosts: {
        //   composite: { port: 5000, publicPath: "/composite" },
        //   dashboard: { port: 5002, publicPath: "/dashboard" },
        // },
      }),
    ]),
    devServer: wp(config.devServer)({
      port: 3000,
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: {
        disableDotRule: true,
      },
    }),
  };
};

module.exports = { webpackConfig };
