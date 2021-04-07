const path = require("path");
const { requireCwd } = require("./require-cwd");

function build(payload) {
  const _payload = payload || {};
  const entry = _payload.entry || "./src/app.tsx";
  const mode = _payload.mode || "development";
  const externals = _payload.externals || ((value) => value);
  const output = _payload.output || ((value) => value);
  const plugins = _payload.plugins || ((value) => value);

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
    externals: externals({
      react: "React",
      "react-dom": "ReactDOM",
    }),
    output: output({
      filename: "index.js",
      path: path.resolve(process.cwd(), "dist"),
      libraryTarget: "commonjs",
    }),
    plugins: plugins([
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
    ]),
  };
}

module.exports = { build };
