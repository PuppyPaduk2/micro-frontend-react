const { start2 } = require("@mcfs/webpack-config");
const { services } = require("@mcfs/configs");
const webpack = require("webpack");

const { ModuleFederationPlugin } = webpack.container;
const name = "signIn";
const { scope, port, exposes } = services.configs[name];

module.exports = start2({
  port,
  publicPath: `http://localhost:${port}/`,

  plugins: (value) => [
    ...value,
    new ModuleFederationPlugin({
      name: scope,
      library: { type: "var", name: scope },
      filename: services.nameRemoteScript,
      exposes: services.convertExposes(exposes),
      remotes: {},
      shared: {},
    }),
  ],
});
