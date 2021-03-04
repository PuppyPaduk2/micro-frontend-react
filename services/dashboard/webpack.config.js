const { start2 } = require("@mcfs/webpack-config");
const { services } = require("@mcfs/configs");
const webpack = require("webpack");

const { ModuleFederationPlugin } = webpack.container;
const { port } = services.configs.dashboard;

module.exports = start2({
  port,
  publicPath: `http://localhost:${port}/`,

  plugins: (value) => [
    ...value,
    new ModuleFederationPlugin({
      name: "dashboard",
      library: { type: "var", name: "dashboard" },
      filename: "remote.js",
      remotes: {},
      exposes: {
        "./DashboardApp": "./exposes/dashboard-app.ts",
      },
      shared: {},
    }),
  ],
});
