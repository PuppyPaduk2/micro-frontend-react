const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;

const SERVICE_KEY = process.env.SERVICE_KEY;

const shared = {
  react: { singleton: true },
  "react-dom": { singleton: true },
  antd: { singleton: true },
  // "libs/socket": { singleton: true },
  // "libs/dynamic-script": { singleton: true },
  // "libs/hooks/use-state-global": { singleton: true },
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
