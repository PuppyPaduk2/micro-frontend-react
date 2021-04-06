const objectPath = require("object-path");

const { getActionState } = require("../../action");
const { readOptions, writeOptions } = require("../../action/options");

const set = () => {
  const { name, value } = getActionState().actionOptions;
  const options = readOptions();

  // objectPath.set(options, name, value);
  options[name] = value;
  writeOptions(options);
};

module.exports = { set };
