const { serviceWebpackConfig } = require("./l-libs/webpack-config");

module.exports = serviceWebpackConfig({
  serviceKey: () => "core",
  shared: () => ({
    react: { singleton: true, eager: true },
    "react-dom": { singleton: true, eager: true },
  }),
});
