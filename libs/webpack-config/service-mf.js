const path = require("path");
const fs = require("fs");
const { ModuleFederationPlugin } = require("webpack").container;

const PATH_COMMON_DIR = path.resolve(process.cwd(), "common");
const PATH_LIBS_DIR = path.resolve(process.cwd(), "libs");

const SERVICE_KEY = process.env.SERVICE_KEY;

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const shared = {
  react: { singleton: true },
  "react-dom": { singleton: true },
  antd: { singleton: true },
  ...getDirectories(PATH_COMMON_DIR).reduce(
    (memo, tail) => ({
      ...memo,
      [`common/${tail}`]: { singleton: true, requiredVersion: "0.0.0" },
    }),
    {}
  ),
  ...getDirectories(PATH_LIBS_DIR).reduce(
    (memo, tail) => ({
      ...memo,
      [`libs/${tail}`]: { singleton: true, requiredVersion: "0.0.0" },
    }),
    {}
  ),
};

const createMf = (config) => {
  return new ModuleFederationPlugin({
    name: config.name,
    library: { type: "var", name: config.name },
    filename: config.filename || "remote.js",
    exposes: Object.entries(config.exposes || {}).reduce(
      (memo, [key, exposePath]) => ({
        ...memo,
        [key]: path.join(
          "./services",
          config.serviceKey || SERVICE_KEY,
          exposePath
        ),
      }),
      {}
    ),
    remotes: config.remotes || {},
    shared: config.shared || shared,
  });
};

const createMfs = (modules = []) => {
  return modules.map(createMf);
};

module.exports = {
  shared,
  createMf,
  createMfs,
};
