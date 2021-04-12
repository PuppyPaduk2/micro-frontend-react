const path = require("path");
const NodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");

const webpackConfig = require("../libs/webpack-config");

module.exports = webpackConfig({
  entry: () => "./services/controller/index.ts",
  resolve: (resolve) => ({
    ...resolve,
    modules: [
      path.resolve(process.cwd(), "./services/controller"),
      path.resolve(process.cwd(), "./node_modules"),
    ],
  }),
  target: () => "node",
  externals: () => [NodeExternals()],
  plugins: () => [
    new NodemonPlugin({
      script: "./dist/index.js",
      watch: "./dist",
      ext: "js,njk,json,ts,tsx",
    }),
  ],
  devServer: () => undefined,
});
