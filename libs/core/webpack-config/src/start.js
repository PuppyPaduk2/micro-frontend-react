const path = require("path");
const { requireCwd } = require("./require-cwd");

function start(payload) {
  const _payload = payload || {};
  const port = _payload.port;
  const entry = _payload.entry || "./src/index.tsx";
  const mode = _payload.mode || "development";
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
    entry,
    mode,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
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
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    externals: externals({}),
    output: output({
      filename: "index.js",
      path: path.resolve(process.cwd(), "dist"),
      publicPath: "/",
    }),
    plugins: plugins([
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
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
