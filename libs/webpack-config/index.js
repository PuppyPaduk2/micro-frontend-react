const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const wp = require("./wp");

module.exports = (config = {}) => {
  const result = {
    context: wp(config.context)(process.cwd()),
    entry: wp(config.entry)(["core-js/stable", "./src/index"]),
    mode: wp(config.mode)("development"),
    target: wp(config.target)(["web", "es5"]),
    module: wp(config.module)({
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)?$/,
          use: {
            loader: require.resolve("babel-loader"),
            options: {
              configFile: path.resolve(__dirname, "./babel.config.js"),
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, require.resolve("css-loader")],
        },
        {
          test: /\.svg$/,
          use: [
            require.resolve("@svgr/webpack"),
            require.resolve("url-loader"),
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [{ loader: require.resolve("url-loader") }],
        },
      ],
    }),
    resolve: wp(config.resolve)({
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        libs: path.resolve(process.cwd(), "./libs"),
        services: path.resolve(process.cwd(), "./services"),
      },
      modules: [
        path.resolve(process.cwd(), "./src"),
        path.resolve(process.cwd(), "./node_modules"),
      ],
    }),
    externals: wp(config.externals)([]),
    output: wp(config.output)({
      filename: "index.js",
      path: path.resolve(process.cwd(), "dist"),
      publicPath: `http://localhost:3000/`,
    }),
    plugins: wp(config.plugins)([]),
    devServer: wp(config.devServer)({
      port: 3000,
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: {
        disableDotRule: true,
      },
      proxy: wp(config.devServerProxy)([]),
    }),
  };

  if (
    result.devServer &&
    result.devServer.proxy instanceof Array &&
    !result.devServer.proxy.length
  ) {
    delete result.devServer.proxy;
  }

  return result;
};
