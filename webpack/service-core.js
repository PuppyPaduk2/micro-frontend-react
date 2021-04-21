const serviceSettings = require("../libs/webpack-config/service-settings");
const { shared, createMf } = require("../libs/webpack-config/service-mf");

module.exports = {
  ...serviceSettings,
  plugins: [
    ...serviceSettings.plugins,
    createMf({
      name: "core",
      shared: Object.entries(shared).reduce((memo, [key, config]) => {
        const next = { ...config };
        next.eager = true;
        if (key === "react") next.requiredVersion = "^17.0.1";
        return { ...memo, [key]: next };
      }, {}),
    }),
  ],
};
