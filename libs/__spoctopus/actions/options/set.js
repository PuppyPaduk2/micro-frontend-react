const path = require("path");
const fs = require("fs");

const { getOptions, writeOptions } = require("../../utils/action/options");

const set = (name, value) => {
  const options = getOptions();

  if (name === "config") setConfig(value);
  else options[name] = value;

  writeOptions();
};

const setConfig = (value) => {
  const options = getOptions();
  const config = getConfigFile(value);

  if (config) options.config = config;
  else delete options.config;
};

const getConfigFile = (value) => {
  const file = path.resolve(process.cwd(), value);

  if (fs.existsSync(file)) return file;
};

module.exports = { set };
