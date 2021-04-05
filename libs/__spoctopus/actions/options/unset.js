const { getOptions, writeOptions } = require("../../utils/action/options");

const unset = (name) => {
  const options = getOptions();
  delete options[name];
  writeOptions();
};

module.exports = { unset };
