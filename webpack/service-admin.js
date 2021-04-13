const webpackConfigService = require("../libs/webpack-config/service");

module.exports = webpackConfigService(
  {},
  {
    serviceKey: "admin",
    modulesFederation: [
      {
        name: "admin",
        filename: "remote.js",
        shared: {
          react: { singleton: true, eager: true },
          "react-dom": { singleton: true, eager: true },
          antd: { singleton: true, eager: true },
        },
      },
    ],
  }
);
