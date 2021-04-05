const { update: updateOptions } = require("./options");
const { update: updateArgs } = require("./args");
const { update: updateConfig } = require("./config");

const wrapper = (program, callback) => {
  return (...args) => {
    updateOptions(program);
    updateArgs(args);
    updateConfig();

    // console.log("config:", config());
    // console.log("extConfig", extConfig());

    return callback(...args);
  };
};

module.exports = { wrapper };
