const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;

const configServices = require("../../configs/services.json");
const { setProcessEnv } = require("../../libs/process-utils");
const { getDirectories } = require("../../libs/fs-utils");

const getServiceEnv = async (env = {}) => {
  const PLACE_OF_START = process.env.PLACE_OF_START || "terminal";
  const SERVICE_KEY = process.env.SERVICE_KEY || "unknown";

  const configService = configServices[SERVICE_KEY];

  const MODE = process.env.MODE || "development";
  const HOST_NAME =
    process.env.HOST_NAME || configService.hostName || "0.0.0.0";
  const PORT = process.env.PORT || configService.port || 7070;
  const HOST = process.env.HOST || configService.host || `0.0.0.0:7070`;

  return {
    MODE,
    PLACE_OF_START,
    SERVICE_KEY,
    HOST_NAME,
    PORT,
    HOST,
    ...env,
  };
};

const setupServiceEnv = async (env = {}) => {
  env = await getServiceEnv(env);
  Object.entries(env).forEach(([key, value]) => setProcessEnv(key, value));
  return env;
};

const getDependsByDir = (dir) => {
  const { name } = path.parse(dir);
  return getDirectories(dir).reduce((memo, tail) => {
    const key = `${name}/${tail}`;
    memo[key] = { singleton: true, requiredVersion: "0.0.1" };
    return memo;
  }, {});
};

const setupShaderByDirs = () => {
  const commonDir = path.resolve(process.cwd(), "common");
  const libsDir = path.relative(process.cwd(), "libs");

  return {
    react: { singleton: true },
    "react-dom": { singleton: true },
    antd: { singleton: true },
    ...getDependsByDir(commonDir),
    ...getDependsByDir(libsDir),
  };
};

const getServiceExposes = async (env = {}, exposes = {}) => {
  const { SERVICE_KEY } = await getServiceEnv(env);
  return Object.entries(exposes).reduce((memo, [key, exposeFile]) => {
    memo[key] = path.join("./services", SERVICE_KEY, exposeFile);
    return memo;
  }, {});
};

const createModuleFederation = async (env = {}, config = {}) => {
  const {
    name,
    filename = "remote.js",
    exposes = {},
    remotes = {},
    shared = setupShaderByDirs(),
  } = config;

  return new ModuleFederationPlugin({
    name,
    library: { type: "var", name },
    filename,
    exposes: await getServiceExposes(env, exposes),
    remotes,
    shared,
  });
};

module.exports = {
  getServiceEnv,
  setupServiceEnv,
  getDependsByDir,
  setupShaderByDirs,
  getServiceExposes,
  createModuleFederation,
};
