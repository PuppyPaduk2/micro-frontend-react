const webpackConfigService = require("../libs/webpack-config/service");

module.exports = webpackConfigService({
  serviceKey: () => "auth",
  exposes: () => ({
    "./App": "./exposes/app.ts",
  }),
});
