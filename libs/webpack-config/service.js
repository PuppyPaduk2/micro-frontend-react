const { serviceHooks } = require("./service-hooks");
const build = require("./build");
const { getServicesConfig } = require("../settings").utils;

module.exports = build(
  serviceHooks,
  async ({ serviceKey, modulesFederation = [] }) => {
    const servicesConfig = await getServicesConfig();
    const serviceConfig = servicesConfig[serviceKey] || {};

    delete servicesConfig.controller;
    delete servicesConfig.admin;
    delete servicesConfig[serviceKey];

    return {
      servicesConfig,
      serviceConfig,
      serviceKey,
      modulesFederation,
    };
  }
);
