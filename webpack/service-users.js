const serviceSettings = require("../libs/webpack-config/__service-settings");
const { shared, createMf } = require("../libs/webpack-config/__service-utils");

module.exports = {
  ...serviceSettings,
  plugins: [
    ...serviceSettings.plugins,
    createMf({
      name: "users",
      exposes: {
        "./App": "./exposes/app.ts",
      },
    }),
  ],
};
