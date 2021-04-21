const path = require("path");
const NodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const serviceSettings = require("../libs/webpack-config/service-settings");

module.exports = {
  ...serviceSettings,
  target: "node",
  externals: [NodeExternals()],
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configOverwrite: {
          include: [`./services/controller/src/index.*`],
        },
      },
    }),
    new NodemonPlugin({
      script: "./dist/index.js",
      watch: "./dist",
      ext: "js,njk,json,ts,tsx",
    }),
  ],
  devServer: undefined,
};
