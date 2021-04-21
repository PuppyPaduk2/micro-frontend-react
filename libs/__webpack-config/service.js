const { serviceHooks } = require("./service-hooks");
const build = require("./build");
// const __servicesConfig = require("../../settings/services-config.json");

module.exports = build(
  serviceHooks
  // async ({
  //   serviceKey,
  //   modulesFederation = [],
  // }) => {

  //   return {
  //     serviceKey,
  //     modulesFederation,
  //   };
  // }
);
