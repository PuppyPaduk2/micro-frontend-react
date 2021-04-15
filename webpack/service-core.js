const webpackConfigService = require("../libs/webpack-config/service");

module.exports = webpackConfigService(
  {},
  {
    serviceKey: "core",
    modulesFederation: [
      {
        name: "core",
        filename: "remote.js",
        remotes: {
          auth: "auth",
          dashboard: "dashboard",
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: "^17.0.1" },
          "react-dom": { singleton: true, eager: true },
          antd: { singleton: true, eager: true },
          "libs/socket": { singleton: true, eager: true },
          "libs/dynamic-script": { singleton: true, eager: true },
          "libs/hooks/use-state-global": { singleton: true, eager: true },
        },
      },
    ],
  }
);
