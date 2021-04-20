const path = require("path");
const axios = require("axios");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const { baseHooks } = require("./base-hooks");
const hook = require("./hook");
const servicesConfig = require("../../settings/services-config.json");

const { PLACE_OF_START = "terminal" } = process.env;

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
  publicPath: `${servicesConfig[context.serviceKey].publicPath}/`,
}));

const plugins = hook(baseHooks.plugins(), async ({ value, context }) => [
  ...(await value),
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      configOverwrite: {
        include: [`./services/${context.serviceKey}/src/index.*`],
      },
    },
  }),
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
          "libs/socket": { singleton: true },
          "libs/dynamic-script": { singleton: true },
          "libs/hooks/use-state-global": { singleton: true },
        },
      })
  ),
]);

const devServer = hook(baseHooks.devServer(), async ({ value, context }) => ({
  ...(await value),
  port: servicesConfig[context.serviceKey].port,
  publicPath: servicesConfig[context.serviceKey].publicPath,
  after: (app) => {
    app.get("/for-controller/api/service/place-of-start", (_req, res) => {
      res.send(PLACE_OF_START);
      res.end();
    });

    app.post("/for-controller/api/service/stop", (_req, res) => {
      process.kill(process.pid, "SIGINT");
      res.status(200);
      res.end();
    });

    axios
      .post(
        `${servicesConfig.controller.publicPath}/api/service/${context.serviceKey}/started`,
        { placeOfStart: PLACE_OF_START }
      )
      .catch(() => {});

    let request = null;
    const onServiceStopped = () => {
      if (!request) {
        request = axios
          .post(
            `${servicesConfig.controller.publicPath}/api/service/${context.serviceKey}/stopped`
          )
          .finally(() => process.exit(0));
      }
    };

    process.on("SIGHUP", onServiceStopped);
    process.on("SIGINT", onServiceStopped);
  },
  proxy: [
    {
      context: ["/controller/api"],
      pathRewrite: { "^/controller": "/" },
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
      target: `http://${servicesConfig.controller.host}`,
      secure: false,
    },
    {
      context: ["/controller/socket"],
      pathRewrite: { "^/controller": "/" },
      target: `ws://${servicesConfig.controller.host}`,
      ws: true,
      secure: false,
    },
    ...Object.entries(servicesConfig).map(([key, { publicPath }]) => ({
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
