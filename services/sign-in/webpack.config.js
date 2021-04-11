const { serviceWebpackConfig } = require("./l-libs/webpack-config");

module.exports = serviceWebpackConfig({
  serviceKey: () => "sign-in",
  exposes: () => ({
    "./App": "./exposes/app.ts",
  }),
});
