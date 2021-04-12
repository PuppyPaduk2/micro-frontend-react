const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const axios = require("axios");
const { ModuleFederationPlugin } = require("webpack").container;

const { getServicesConfig } = require("../l-libs/settings");

const wp = (callback = (value) => value) => {
  return callback;
};

const webpackConfig = (config = {}) => {
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

const controllerConfig = getServicesConfig().controller;

const getConfig = () =>
  axios
    .get(`${controllerConfig.publicPath}/api/services/config`)
    .then(({ data }) => data)
    .catch(() => {});

const runService = ({ serviceKey }) =>
  axios
    .post(`${controllerConfig.publicPath}/api/services/run`, { serviceKey })
    .catch(() => {});

const stoppedService = ({ serviceKey }) => {
  let request = null;

  return () => {
    if (!request) {
      request = axios
        .post(`${controllerConfig.publicPath}/api/services/stopped`, {
          serviceKey,
        })
        .finally(() => process.exit(0));
    }

    return request;
  };
};

const getPackageName = () => {
  try {
    const packageJsonFile = path.resolve(process.cwd(), "./package.json");
    return require(packageJsonFile).name;
  } catch (error) {
    return null;
  }
};

const serviceWebpackConfig = async (config = {}) => {
  const packageName = getPackageName();
  const serviceKey = wp(config.serviceKey)(packageName.split("/")[1]);
  const serviceConfigs =
    wp(config.serviceConfigs)(null) || ((await getConfig()) ?? {});
  const serviceConfig = serviceConfigs[serviceKey];

  if (!serviceConfig) process.exit(1);

  const { port, publicPath } = serviceConfig;
  const libScope = serviceKey.replace(/\-/g, "_");

  delete serviceConfigs.controller;
  delete serviceConfigs["admin-dashboard"];
  delete serviceConfigs[serviceKey];

  return webpackConfig({
    ...config,
    output: (output) =>
      wp(config.output)({ ...output, publicPath: `${publicPath}/` }),
    devServerProxy: (proxy) =>
      wp(config.devServerProxy)([
        ...proxy,
        {
          context: ["/controller/api"],
          pathRewrite: { "^/controller": "/" },
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
          target: `http://${controllerConfig.host}`,
          secure: false,
        },
        {
          context: ["/controller/socket"],
          pathRewrite: { "^/controller": "/" },
          target: `ws://${controllerConfig.host}`,
          ws: true,
          secure: false,
        },
        ...Object.entries(serviceConfigs).map(([key, { publicPath }]) => ({
          context: [`/${key}`],
          pathRewrite: { [`^/${key}`]: "" },
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
          target: publicPath,
          secure: false,
        })),
      ]),
    devServer: (devServer) =>
      wp(config.devServer)({
        ...devServer,
        publicPath,
        port,
        after: () => {
          runService({ serviceKey });
          process.on("SIGHUP", stoppedService({ serviceKey }));
          process.on("SIGINT", stoppedService({ serviceKey }));
        },
      }),
    plugins: (plugins) =>
      wp(config.plugins)([
        ...plugins,
        new ModuleFederationPlugin({
          name: libScope,
          library: { type: "var", name: libScope },
          filename: wp(config.remoteFile)("remote.js"),
          exposes: wp(config.exposes)({}),
          remotes: wp(config.remotes)({}),
          shared: wp(config.shared)({}),
        }),
      ]),
  });
};

module.exports = { webpackConfig, serviceWebpackConfig };
