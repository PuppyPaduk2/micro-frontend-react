const path = require("path");
const axios = require("axios");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const baseSettings = require("./base-settings");
const servicesConfig = require("../../settings/services-config.json");

const PLACE_OF_START = process.env.PLACE_OF_START || "terminal";
const SERVICE_KEY = process.env.SERVICE_KEY;

module.exports = {
  ...baseSettings,
  entry: ["core-js/stable", `./services/${SERVICE_KEY}/src/index`],
  resolve: {
    ...baseSettings.resolve,
    modules: [
      path.resolve(process.cwd(), "./services", SERVICE_KEY),
      path.resolve(process.cwd(), "./node_modules"),
    ],
  },
  output: {
    ...baseSettings.output,
    publicPath: `${servicesConfig[SERVICE_KEY].publicPath}/`,
  },
  plugins: [
    ...baseSettings.plugins,
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configOverwrite: {
          include: [`./services/${SERVICE_KEY}/src/index.*`],
        },
      },
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: `./services/${SERVICE_KEY}/public/index.html`,
    }),
  ],
  devServer: {
    ...baseSettings.devServer,
    port: servicesConfig[SERVICE_KEY].port,
    publicPath: servicesConfig[SERVICE_KEY].publicPath,
    after: (app) => {
      // API
      app.get("/for-controller/api/service/place-of-start", (_req, res) => {
        res.send(PLACE_OF_START);
        res.end();
      });
      app.post("/for-controller/api/service/stop", (_req, res) => {
        process.kill(process.pid, "SIGINT");
        res.status(200);
        res.end();
      });

      // Started
      axios
        .post(
          `${servicesConfig.controller.publicPath}/api/service/${SERVICE_KEY}/started`,
          { placeOfStart: PLACE_OF_START }
        )
        .catch(() => {});

      // Stopped
      let request = null;
      const onServiceStopped = () => {
        if (!request) {
          request = axios
            .post(
              `${servicesConfig.controller.publicPath}/api/service/${SERVICE_KEY}/stopped`
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
      ...Object.entries(servicesConfig)
        .filter(
          ([serviceKey]) =>
            serviceKey !== "controller" || serviceKey !== "admin"
        )
        .map(([key, { publicPath }]) => ({
          context: [`/${key}`],
          pathRewrite: { [`^/${key}`]: "" },
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
          target: publicPath,
          secure: false,
        })),
    ],
  },
};
