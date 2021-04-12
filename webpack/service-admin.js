const webpackConfigService = require("../libs/webpack-config/service");

module.exports = webpackConfigService({
  serviceKey: () => "admin",
  shared: () => ({
    react: { singleton: true, eager: true },
    "react-dom": { singleton: true, eager: true },
    antd: { singleton: true, eager: true },
  }),
  // serviceConfigs: () => ({
  //   "admin-dashboard": {
  //     port: 3010,
  //     publicPath: "http://localhost:3010",
  //   },
  // }),
});
