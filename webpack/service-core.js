const webpackConfigService = require("../libs/webpack-config/service");

module.exports = webpackConfigService({
  serviceKey: () => "core",
  shared: () => ({
    react: { singleton: true, eager: true, requiredVersion: "^17.0.1" },
    "react-dom": { singleton: true, eager: true },
    antd: { singleton: true, eager: true },
  }),
});
