const serviceSettings = require("../libs/webpack-config/service-settings");
const { shared, createMf } = require("../libs/webpack-config/service-mf");

module.exports = {
  ...serviceSettings,
  plugins: [
    ...serviceSettings.plugins,
    createMf({
      name: "auth",
      exposes: {
        "./App": "./exposes/app.ts",
        "./guard": "./exposes/guard.ts",
      },
    }),
  ],
};
