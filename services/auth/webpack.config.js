const { serviceWebpackConfig } = require("./l-libs/webpack-config");

module.exports = serviceWebpackConfig({
  serviceKey: () => "auth",
  exposes: () => ({
    "./App": "./exposes/app.ts",
  }),
  shared: () => ({
    react: { singleton: true },
    "react-dom": { singleton: true },
  }),
});
