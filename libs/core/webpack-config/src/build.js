const path = require("path");
const { requireCwd } = require("./require-cwd");

function build(payload) {
  const routeKey = payload.routeKey;
  const entry = payload.entry || "./src/app.tsx";
  const mode = payload.mode || "development";
  const externals = payload.externals || ((value) => value);
  const output = payload.output || ((value) => value);
  const plugins = payload.plugins || ((value) => value);
  const devServer = payload.devServer || ((value) => value);

  if (typeof routeKey !== "string") {
    throw new Error("Set routeKey for webpack config");
  }

  const MiniCssExtractPlugin = requireCwd("mini-css-extract-plugin");
  const HtmlWebpackPlugin = requireCwd("html-webpack-plugin");
  const { routes } = requireCwd("@mcfs/routes");

  const route = routes[routeKey];

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
    devServer: devServer({
      port: route.port,
    }),
  };
}

module.exports = { build };
