const { start } = require("@mcfs/webpack-config");
const { routes } = require("@mcfs/routes");

module.exports = start({ port: routes.composite.port });
