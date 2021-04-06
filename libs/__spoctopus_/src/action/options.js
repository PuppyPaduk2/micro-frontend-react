const fs = require("fs");

const { FULL_PATHS } = require("../constants");
const { read, write } = require("../utils/fs-json");

const { OPTIONS_FILE } = FULL_PATHS;

const readOptions = () => {
  if (fs.existsSync(OPTIONS_FILE)) return read(OPTIONS_FILE);
  else return {};
};

const writeOptions = (options = {}) => {
  write(OPTIONS_FILE, options);
};

module.exports = { readOptions, writeOptions };
