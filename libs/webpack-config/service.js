const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const axios = require("axios");
const { ModuleFederationPlugin } = require("webpack").container;

const webpackConfig = require(".");
const { getServicesConfig } = require("../settings");
const wp = require("./wp");

const controllerConfig = getServicesConfig().controller;

const getConfig = async () => {
  try {
    const url = `${controllerConfig.publicPath}/api/services/config`;
    return (await axios.get(url)).data;
  } catch (error) {
    return {};
  }
};

const runService = ({ serviceKey }) => {
  return axios
    .post(`${controllerConfig.publicPath}/api/services/run`, { serviceKey })
    .catch(() => {});
};

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

module.exports = async (config = {}) => {
  const serviceKey = wp(config.serviceKey)(null);
  const serviceConfigs = wp(config.serviceConfigs)(null) || (await getConfig());
  const serviceConfig = serviceConfigs[serviceKey] || {};

  const { port, publicPath = "" } = serviceConfig;
  const libScope = serviceKey.replace(/\-/g, "_");

  delete serviceConfigs.controller;
  delete serviceConfigs["admin-dashboard"];
  delete serviceConfigs[serviceKey];

  return webpackConfig({
    ...config,
    entry: () =>
      wp(config.entry)([
        "core-js/stable",
        `./services/${serviceKey}/src/index`,
      ]),
    resolve: (resolve) => ({
      ...resolve,
      modules: [
        path.resolve(process.cwd(), "./services", serviceKey),
        path.resolve(process.cwd(), "./node_modules"),
      ],
    }),
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

        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
          template: `./services/${serviceKey}/public/index.html`,
        }),
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
