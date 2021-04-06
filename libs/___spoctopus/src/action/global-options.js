const fs = require("fs");
const path = require("path");

const { PATHS } = require("../constants");
const { write } = require("../utils/fs-json");
const { getRef } = require("./ref");

const readGlobalOptions = () => {
  const optionsFile = getOptionsFile();

  if (fs.existsSync(optionsFile)) return read(optionsFile);
  else return {};
};

const writeGlobalOptions = () => {
  const optionsFile = getOptionsFile();

  write(optionsFile, getRef().globalOptions);
};

const getOptionsFile = () => {
  return path.resolve(__dirname, PATHS.OPTIONS_FILE);
};

module.exports = { readGlobalOptions, writeGlobalOptions };
