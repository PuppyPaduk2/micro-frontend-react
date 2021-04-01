const { update: updateOptions, getOptions } = require("./options");
const { update: updateArgs } = require("./args");
const { update: updateConfig, config, extConfig } = require("./config");
const { FULL_PATHS } = require("../../constants");

const wrapper = (program, callback) => {
  return (...args) => {
    updateOptions(program);
    updateArgs(args);
    updateConfig(getOptions().config || FULL_PATHS.CONFIG);

    // console.log("config:", config());
    // console.log("extConfig", extConfig());

    return callback(...args);
  };
};

module.exports = { wrapper };
