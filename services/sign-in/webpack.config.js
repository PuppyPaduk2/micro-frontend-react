const { serviceWebpackConfig } = require("./l-libs/webpack-config");

module.exports = serviceWebpackConfig({
  serviceKey: () => "sign-in",
  // serviceConfig: () => () => ({ port: 3010 }),
});
