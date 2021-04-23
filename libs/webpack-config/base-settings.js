const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getBaseSettings = async (env = {}) => {
  const { PORT, MODE } = {
    PORT: process.env.PORT || 3000,
    MODE: process.env.MODE || "development",
    ...env,
  };

  return {
    context: process.cwd(),
    entry: ["core-js/stable", "./src/index"],
    mode: MODE,
    target: ["web", "es5"],
    module: {
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
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        configs: path.resolve(process.cwd(), "./configs"),
        api: path.resolve(process.cwd(), "./api"),
        libs: path.resolve(process.cwd(), "./libs"),
        services: path.resolve(process.cwd(), "./services"),
        common: path.resolve(process.cwd(), "./common"),
      },
      modules: [
        path.resolve(process.cwd(), "./src"),
        path.resolve(process.cwd(), "./node_modules"),
      ],
    },
    externals: [],
    output: {
      filename: "index.js",
      path: path.resolve(process.cwd(), "dist"),
      // publicPath: `http://localhost:${PORT}/`,
    },
    plugins: [],
    devServer: {
      port: PORT,
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: {
        disableDotRule: true,
      },
    },
  };
};

module.exports = { getBaseSettings };
