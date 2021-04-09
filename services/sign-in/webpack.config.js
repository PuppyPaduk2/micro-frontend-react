const { serviceWebpackConfig } = require("./l-libs/webpack-config");

module.exports = serviceWebpackConfig({
  serviceKey: () => "signIn",
  // serviceConfig: () => () => ({ port: 3010 }),
});
