const { start2 } = require("@mcfs/webpack-config");
const { services } = require("@mcfs/configs");
const webpack = require("webpack");

const { ModuleFederationPlugin } = webpack.container;
const { port } = services.configs.composite;

module.exports = start2({
  port,
  publicPath: `http://localhost:${port}/`,

  plugins: (value) => [
    ...value,
    new ModuleFederationPlugin({
      name: "composite",
      library: { type: "var", name: "composite" },
      filename: "remote.js",
      remotes: {
        dashboard: "dashboard",
      },
      exposes: {},
      shared: {},
    }),
  ],
});
