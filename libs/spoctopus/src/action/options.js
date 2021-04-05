const fs = require("fs");

const { FULL_PATHS } = require("../constants");

const { OPTIONS_FILE } = FULL_PATHS;

const readOptions = () => {
  if (fs.existsSync(OPTIONS_FILE)) return read(OPTIONS_FILE);
  else return {};
};

const writeOptions = () => {
  write(OPTIONS_FILE, options);
};

module.exports = { readOptions, writeOptions };
