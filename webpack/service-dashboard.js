const serviceSettings = require("../libs/webpack-config/service-settings");
const { shared, createMf } = require("../libs/webpack-config/service-mf");

module.exports = {
  ...serviceSettings,
  plugins: [
    ...serviceSettings.plugins,
    createMf({
      name: "dashboard",
      exposes: {
        "./App": "./exposes/app.ts",
      },
    }),
  ],
};
