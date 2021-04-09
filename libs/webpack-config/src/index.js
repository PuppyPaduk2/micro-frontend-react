const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const axios = require("axios");

const wp = (callback = (value) => value) => {
  return callback;
};

const webpackConfig = (config = {}) => {
  return {
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

const getConfig = (baseUrl, serviceKey) =>
  axios
    .get(`${baseUrl}/api/services/config/${serviceKey}`)
    .then(({ data }) => data)
    .catch(() => {});

const runService = (baseUrl, serviceKey) =>
  axios.post(`${baseUrl}/api/services/run`, { serviceKey }).catch(() => {});

const stoppedService = (baseUrl, serviceKey) => {
  let request = null;

  return () => {
    if (!request) {
      request = axios
        .post(`${baseUrl}/api/services/stopped`, { serviceKey })
        .finally(() => process.exit(0));
    }

    return request;
  };
};

const serviceWebpackConfig = async (config = {}) => {
  const baseUrl = `http://localhost:2999`;
  const serviceKey = wp(config.serviceKey)(null);
  const serviceConfig = await wp(config.serviceConfig)(getConfig)(
    baseUrl,
    serviceKey
  );

  if (!serviceConfig) process.exit(1);

  const { port } = serviceConfig;

  return webpackConfig({
    output: (output) =>
      wp(config.output)({
        ...output,
        publicPath: `http://localhost:${port}/`,
      }),
    devServer: (devServer) =>
      wp(config.devServer)({
        ...devServer,
        port,
        after: () => {
          runService(baseUrl, serviceKey);
          process.on("SIGHUP", stoppedService(baseUrl, serviceKey));
          process.on("SIGINT", stoppedService(baseUrl, serviceKey));
        },
      }),
  });
};

module.exports = { webpackConfig, serviceWebpackConfig };
