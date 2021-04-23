const path = require("path");
const axios = require("axios");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const configServices = require("../../configs/services.json");

const { getServiceSettings } = require("./service-settings");
const { setupServiceEnv, getServiceEnv } = require("./service-utils");

const getServiceSettingsFrontend = async (env = {}) => {
  const { SERVICE_KEY, PLACE_OF_START } = await getServiceEnv(env);
  const settings = await getServiceSettings(env);

  return {
    ...settings,
    plugins: [
      ...settings.plugins,
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
      ...settings.devServer,
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
            `http://${configServices.controller.host}/api/service/${SERVICE_KEY}/started`,
            {
              placeOfStart: PLACE_OF_START,
            }
          )
          .catch(() => {});

        // Stopped
        let request = null;
        const onServiceStopped = () => {
          if (!request) {
            request = axios
              .post(
                `http://${configServices.controller.host}/api/service/${SERVICE_KEY}/stopped`
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
          pathRewrite: { "^/controller": "" },
          changeOrigin: true,
          target: `http://${configServices.controller.host}`,
          secure: false,
        },
        {
          context: ["/controller/socket"],
          pathRewrite: { "^/controller": "" },
          target: `ws://${configServices.controller.host}`,
          ws: true,
          secure: false,
        },
        ...Object.entries(configServices)
          .filter(
            ([serviceKey]) =>
              serviceKey !== "controller" || serviceKey !== "admin"
          )
          .map(([key, { host }]) => ({
            context: [`/${key}`],
            pathRewrite: { [`^/${key}`]: "" },
            changeOrigin: true,
            target: `http://${host}`,
            secure: false,
          })),
      ],
    },
  };
};

module.exports = { getServiceSettingsFrontend };
