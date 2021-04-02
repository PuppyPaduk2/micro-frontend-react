const { cleanOptions, writeOptions } = require("../../utils/action/options");

const clean = () => {
  cleanOptions();
  writeOptions();
};

module.exports = { clean };
