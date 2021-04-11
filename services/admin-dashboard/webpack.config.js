const { serviceWebpackConfig } = require("./l-libs/webpack-config");

module.exports = serviceWebpackConfig({
  serviceKey: () => "admin-dashboard",
  // serviceConfigs: () => ({
  //   "admin-dashboard": {
  //     port: 3010,
  //     publicPath: "http://localhost:3010",
  //   },
  // }),
});
