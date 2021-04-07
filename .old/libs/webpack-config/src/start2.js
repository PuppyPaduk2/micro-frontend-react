const path = require("path");
const { requireCwd } = require("./require-cwd");

function start(payload) {
  const _payload = payload || {};
  const port = _payload.port;
  const publicPath = _payload.publicPath || "/";
  const mode = _payload.mode || ((value) => value);
  const entry = _payload.entry || ((value) => value);
  const target = _payload.target || ((value) => value);
  const _module = _payload.module || ((value) => value);
  const resolve = _payload.resolve || ((value) => value);
  const externals = _payload.externals || ((value) => value);
  const output = _payload.output || ((value) => value);
  const plugins = _payload.plugins || ((value) => value);
  const devServer = _payload.devServer || ((value) => value);

  if (typeof port !== "number") {
    throw new Error("Set 'port' for webpack config");
  }

  const MiniCssExtractPlugin = requireCwd("mini-css-extract-plugin");
  const HtmlWebpackPlugin = requireCwd("html-webpack-plugin");

  return {
    entry: entry(["core-js/stable", "./src/index"]),
    mode: mode("development"),
    target: target(["web", "es5"]),
    module: _module({
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)?$/,
          use: { loader: "babel-loader" },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack", "url-loader"],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [{ loader: "url-loader" }],
        },
      ],
    }),
    resolve: resolve({
      extensions: [".tsx", ".ts", ".js"],
      modules: [
        path.resolve(process.cwd(), "./src"),
        path.resolve(process.cwd(), "./node_modules"),
      ],
    }),
    externals: externals({}),
    output: output({
      filename: "index.js",
      path: path.resolve(process.cwd(), "dist"),
      publicPath,
    }),
    plugins: plugins([
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        hosts: {
          composite: { port: 5000, publicPath: "/composite" },
          dashboard: { port: 5002, publicPath: "/dashboard" },
        },
      }),
    ]),
    devServer: devServer({
      port,
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: {
        disableDotRule: true,
      },
    }),
  };
}

module.exports = { start };
