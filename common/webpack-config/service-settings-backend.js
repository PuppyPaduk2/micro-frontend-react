const NodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const { getServiceSettings } = require("./service-settings");
const { getServiceEnv } = require("./service-utils");

const getServiceSettingsBackend = async (arv = {}) => {
  const { SERVICE_KEY } = await getServiceEnv(arv);
  const settings = await getServiceSettings(arv);

  return {
    ...settings,
    target: "node",
    externals: [NodeExternals()],
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configOverwrite: {
            include: [`./services/${SERVICE_KEY}/src/index.*`],
          },
        },
      }),
      new NodemonPlugin({
        script: `./${SERVICE_KEY}/dist/index.js`,
        watch: `./${SERVICE_KEY}/dist`,
        ext: "js,njk,json,ts,tsx",
      }),
    ],
    devServer: undefined,
  };
};

module.exports = { getServiceSettingsBackend };
