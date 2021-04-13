const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const { baseHooks } = require("./base-hooks");
const hook = require("./hook");
const { getServicesConfig, utils } = require("../settings");

const entry = hook([], ({ context }) => [
  "core-js/stable",
  `./services/${context.serviceKey}/src/index`,
]);

const resolve = hook(baseHooks.resolve(), async ({ value, context }) => ({
  ...(await value),
  modules: [
    path.resolve(process.cwd(), "./services", context.serviceKey),
    path.resolve(process.cwd(), "./node_modules"),
  ],
}));

const output = hook(baseHooks.output(), async ({ value, context }) => ({
  ...(await value),
  publicPath: `${context.serviceConfig.publicPath}/`,
}));

const plugins = hook(baseHooks.plugins(), async ({ value, context }) => [
  ...(await value),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: `./services/${context.serviceKey}/public/index.html`,
  }),
  ...(context.modulesFederation || []).map(
    (config) =>
      new ModuleFederationPlugin({
        name: config.name,
        library: { type: "var", name: config.name },
        filename: config.filename,
        exposes: Object.entries(config.exposes || {}).reduce(
          (memo, [key, exposePath]) => ({
            ...memo,
            [key]: path.join("./services", context.serviceKey, exposePath),
          }),
          {}
        ),
        remotes: config.remotes || {},
        shared: config.shared || {
          react: { singleton: true },
          "react-dom": { singleton: true },
          antd: { singleton: true },
        },
      })
  ),
]);

const controllerConfig = getServicesConfig().controller;

const devServer = hook(baseHooks.devServer(), async ({ value, context }) => ({
  ...(await value),
  port: context.serviceConfig.port,
  publicPath: context.serviceConfig.publicPath,
  after: () => {
    utils.runService({ serviceKey: context.serviceKey });
    process.on("SIGHUP", utils.stopService({ serviceKey: context.serviceKey }));
    process.on("SIGINT", utils.stopService({ serviceKey: context.serviceKey }));
  },
  proxy: [
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
    ...Object.entries(context.servicesConfig).map(([key, { publicPath }]) => ({
      context: [`/${key}`],
      pathRewrite: { [`^/${key}`]: "" },
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
      target: publicPath,
      secure: false,
    })),
  ],
}));

module.exports = {
  serviceHooks: {
    ...baseHooks,
    entry,
    resolve,
    output,
    plugins,
    devServer,
  },
};
