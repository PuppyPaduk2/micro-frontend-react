const webpackConfigService = require("../libs/webpack-config/service");

module.exports = webpackConfigService(
  {},
  {
    serviceKey: "users",
    modulesFederation: [
      {
        name: "users",
        filename: "remote.js",
        remotes: {},
        exposes: { "./App": "./exposes/app.ts" },
      },
    ],
  }
);
