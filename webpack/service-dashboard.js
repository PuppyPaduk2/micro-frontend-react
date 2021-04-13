const webpackConfigService = require("../libs/webpack-config/service");

module.exports = webpackConfigService(
  {},
  {
    serviceKey: "dashboard",
    modulesFederation: [
      {
        name: "dashboard",
        filename: "remote.js",
        exposes: {
          "./App": "./exposes/app.ts",
        },
      },
    ],
  }
);
