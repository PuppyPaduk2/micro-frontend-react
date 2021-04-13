const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const hook = require("./hook");

const context = hook(process.cwd());

const entry = hook(["core-js/stable", "./src/index"]);

const mode = hook("development");

const target = hook(["web", "es5"]);

const _module = hook({
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
      use: [require.resolve("@svgr/webpack"), require.resolve("url-loader")],
    },
    {
      test: /\.(png|jpe?g|gif)$/i,
      use: [{ loader: require.resolve("url-loader") }],
    },
  ],
});

const resolve = hook({
  extensions: [".tsx", ".ts", ".js"],
  alias: {
    libs: path.resolve(process.cwd(), "./libs"),
    services: path.resolve(process.cwd(), "./services"),
  },
  modules: [
    path.resolve(process.cwd(), "./src"),
    path.resolve(process.cwd(), "./node_modules"),
  ],
});

const externals = hook([]);

const output = hook({
  filename: "index.js",
  path: path.resolve(process.cwd(), "dist"),
  publicPath: `http://localhost:3000/`,
});

const plugins = hook([]);

const devServer = hook({
  port: 3000,
  contentBase: path.join(__dirname, "dist"),
  historyApiFallback: {
    disableDotRule: true,
  },
});

module.exports = {
  baseHooks: {
    context,
    entry,
    mode,
    target,
    module: _module,
    resolve,
    externals,
    output,
    plugins,
    devServer,
  },
};
