const { start } = require("@mcfs/webpack-config");
const { services } = require("@mcfs/configs");

module.exports = start({ port: services.configs.composite.port });
