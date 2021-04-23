const { getServiceSettingsBackend } = require("../common/webpack-config");

module.exports = getServiceSettingsBackend();

// const path = require("path");
// const NodeExternals = require("webpack-node-externals");
// const NodemonPlugin = require("nodemon-webpack-plugin");
// const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

// const { removeProps } = require("../libs/object-utils");
// const { buildSettings, serviceSettings } = require("../libs/webpack-config");
// const getServicesConfig = require("../settings/services-config");

// module.exports = buildSettings({
//   before: async () => {
//     const config = await getServicesConfig();

//     process.env.PORT = process.env.PORT || config.controller.port;
//     process.env.SERVICE_KEY = "controller";
//   },
//   settings: removeProps(serviceSettings, ["devServer"]),
//   added: {
//     target: "node",
//     externals: [NodeExternals()],
//     plugins: [
//       new ForkTsCheckerWebpackPlugin({
//         typescript: {
//           configOverwrite: {
//             include: [`./services/controller/src/index.*`],
//           },
//         },
//       }),
//       new NodemonPlugin({
//         script: "./dist/index.js",
//         watch: "./dist",
//         ext: "js,njk,json,ts,tsx",
//       }),
//     ],
//   },
// });
