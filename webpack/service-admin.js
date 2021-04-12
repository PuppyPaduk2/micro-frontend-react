const webpackConfigService = require("../libs/webpack-config/service");

module.exports = webpackConfigService({
  serviceKey: () => "admin",
  // serviceConfigs: () => ({
  //   "admin-dashboard": {
  //     port: 3010,
  //     publicPath: "http://localhost:3010",
  //   },
  // }),
});
