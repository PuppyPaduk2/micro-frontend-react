const { serviceHooks } = require("./service-hooks");
const build = require("./build");
const __servicesConfig = require("../../settings/services-config.json");

module.exports = build(
  serviceHooks,
  async ({
    servicesConfig: _servicesConfig,
    serviceKey,
    modulesFederation = [],
  }) => {
    const servicesConfig = _servicesConfig || __servicesConfig;
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
