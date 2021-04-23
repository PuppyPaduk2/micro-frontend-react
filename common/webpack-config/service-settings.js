const path = require("path");

const configServices = require("../../configs/services.json");
const { getBaseSettings } = require("../../libs/webpack-config");
const { getServiceEnv, setupServiceEnv } = require("./service-utils");

const getServiceSettings = async (env = {}) => {
  const {
    PLACE_OF_START,
    SERVICE_KEY,
    HOST_NAME,
    PORT,
    HOST,
  } = await setupServiceEnv(env);
  const settings = await getBaseSettings(env);

  return {
    ...settings,
    entry: ["core-js/stable", `./services/${SERVICE_KEY}/src/index`],
    resolve: {
      ...settings.resolve,
      modules: [
        path.resolve(process.cwd(), "./services", SERVICE_KEY),
        path.resolve(process.cwd(), "./node_modules"),
      ],
    },
    devServer: {
      ...settings.devServer,
      host: HOST_NAME,
      port: PORT,
      public: HOST,
    },
  };
};

module.exports = { getServiceSettings };
