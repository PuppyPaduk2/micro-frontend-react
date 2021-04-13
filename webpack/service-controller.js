const path = require("path");
const NodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const webpackConfig = require("../libs/webpack-config");

module.exports = webpackConfig({
  entry: () => "./services/controller/index.ts",
  resolve: ({ value }) => ({
    ...value,
    modules: [
      path.resolve(process.cwd(), "./services/controller"),
      path.resolve(process.cwd(), "./node_modules"),
    ],
  }),
  target: () => "node",
  externals: () => [NodeExternals()],
  plugins: () => [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configOverwrite: {
          include: [`./services/controller/index.*`],
        },
      },
    }),
    new NodemonPlugin({
      script: "./dist/index.js",
      watch: "./dist",
      ext: "js,njk,json,ts,tsx",
    }),
  ],
  devServer: () => undefined,
});
