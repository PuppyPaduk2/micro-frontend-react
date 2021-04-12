const { webpackConfig } = require("./l-libs/webpack-config");
const NodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = webpackConfig({
  entry: () => "./src/index.ts",
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
