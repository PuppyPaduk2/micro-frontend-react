const { start2 } = require("@mcfs/webpack-config");
const { services } = require("@mcfs/configs");
const webpack = require("webpack");

const { ModuleFederationPlugin } = webpack.container;
const name = "signIn";
const { port } = services.configs[name];

module.exports = start2({
  port,
  publicPath: `http://localhost:${port}/`,

  plugins: (value) => [
    ...value,
    new ModuleFederationPlugin({
      name,
      library: { type: "var", name },
      filename: "remote.js",
      remotes: {},
      exposes: {
        "./SignInApp": "./exposes/app.ts",
      },
      shared: {},
    }),
  ],
});
