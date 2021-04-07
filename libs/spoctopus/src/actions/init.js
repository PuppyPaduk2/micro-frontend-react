const fs = require("fs");

const { PACKAGE_VERSION } = require("../constants");
const { write } = require("../utils/fs-json");
const { getStateFile } = require("./common");
const search = require("./search");

const init = () => {
  const stateFile = getStateFile();

  write(stateFile, { version: PACKAGE_VERSION, packages: {} });
  search();
};

module.exports = () => {
  if (!fs.existsSync(getStateFile())) init();
};
